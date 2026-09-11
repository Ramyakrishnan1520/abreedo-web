import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { EmployerDetailView } from '#/components/admin/employer/EmployerDetailView.tsx'
import { EmployerForm } from '#/components/admin/employer/EmployerForm.tsx'
import { getEmployerTableColumns } from '#/components/admin/employer/employer-table-columns.tsx'
import { EmployerTableFilters } from '#/components/admin/employer/employer-table-filters.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { useDebouncedValue } from '#/hooks/common/use-debounced-value.ts'
import { useEmployers } from '#/hooks/employer/use-employers.ts'
import { useEmployer } from '#/hooks/employer/useEmployerById.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { mapEmployerDetailToFormValues } from '#/utils/mapEmployerDetailToFormValues.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Employer } from '#/types/employer.ts'

const copy = EMPLOYER_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit-general' | 'edit-plan'

export function EditEmployerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(
    null,
  )
  const [parentCompanyId, setParentCompanyId] = useState<string | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const activeSearch = useDebouncedValue(searchTerm)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 },
    )
  }, [activeSearch])

  const {
    data: employersResult,
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
    isFetching,
    refetch,
  } = useEmployers(
    parentCompanyId,
    {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
    activeSearch,
  )

  const {
    data: employerDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useEmployer(selectedEmployerId ?? undefined)

  const allEmployers = employersResult?.items ?? []

  const filteredEmployers = useMemo(() => {
    if (!activeSearch.trim()) return allEmployers
    const term = activeSearch.trim().toLowerCase()
    return allEmployers.filter(
      (employer) =>
        employer.name.toLowerCase().includes(term) ||
        employer.parentCompanyName.toLowerCase().includes(term),
    )
  }, [allEmployers, activeSearch])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleParentCompanyChange = useCallback((id: string | undefined) => {
    setParentCompanyId(id)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const columns = useMemo(
    () =>
      getEmployerTableColumns({
        onView: (employer: Employer) => {
          setSelectedEmployerId(String(employer.id))
          setViewMode('view')
        },
      }),
    [],
  )

  const handleBackToTable = () => {
    setViewMode('table')
    setSelectedEmployerId(null)
  }

  const handleEditGeneralFromView = () => {
    setViewMode('edit-general')
  }

  const handleEditPlanFromView = () => {
    setViewMode('edit-plan')
  }

  const initialValues = employerDetail
    ? mapEmployerDetailToFormValues(employerDetail)
    : undefined

  return (
    <main className="page-wrap space-y-6">
      {/* Table View with Search */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          <h1 className="display-title text-3xl font-bold text-slate-900">
            {copy.title}
          </h1>

          <EmployerTableFilters
            parentCompanyId={parentCompanyId}
            searchTerm={searchTerm}
            onParentCompanyChange={handleParentCompanyChange}
            onSearchTermChange={setSearchTerm}
            onClearSearch={handleClearSearch}
          />

          {/* List Load Error Banner */}
          {isListError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  {listError instanceof Error
                    ? listError.message
                    : copy.errors.listLoad}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : null}

          {/* Employer Table */}
          <ReusableTable
            data={filteredEmployers}
            columns={columns}
            loading={isLoadingList}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={employersResult?.totalPages}
            rowCount={
              activeSearch
                ? filteredEmployers.length
                : (employersResult?.totalCount ?? 0)
            }
          />
        </div>
      ) : null}

      {/* View Detail Page */}
      {viewMode === 'view' && selectedEmployerId ? (
        <EmployerDetailView
          employerId={selectedEmployerId}
          onBack={handleBackToTable}
          onEditGeneral={handleEditGeneralFromView}
          onEditPlan={handleEditPlanFromView}
          onDeleteSuccess={handleBackToTable}
        />
      ) : null}

      {/* Multi-Step Edit Form */}
      {(viewMode === 'edit-general' || viewMode === 'edit-plan') &&
      selectedEmployerId ? (
        isLoadingDetail ? (
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="flex items-center justify-center gap-3 py-16 text-sm text-slate-600">
              <span className="size-4 animate-spin rounded-full border-2 border-tan-dark border-t-transparent" />
              {copy.loadingDetails}
            </CardContent>
          </Card>
        ) : isDetailError ? (
          <Card className="border-destructive/30 bg-destructive/5 shadow-none">
            <CardContent className="flex items-center justify-between py-6 text-sm text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                {copy.errors.detailLoad}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBackToTable}
              >
                {copy.backButton}
              </Button>
            </CardContent>
          </Card>
        ) : initialValues ? (
          <EmployerForm
            key={`${selectedEmployerId}-${viewMode}`}
            mode={viewMode}
            employerId={selectedEmployerId}
            initialValues={initialValues}
            onBack={() => setViewMode('view')}
            onSuccess={handleBackToTable}
          />
        ) : null
      ) : null}
    </main>
  )
}
