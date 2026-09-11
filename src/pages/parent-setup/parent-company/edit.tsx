import { useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { ParentCompanyDetailView } from '#/components/admin/parent-company/ParentCompanyDetailView.tsx'
import { ParentCompanyForm } from '#/components/admin/parent-company/ParentCompanyForm.tsx'
import { getParentCompanyTableColumns } from '#/components/admin/parent-company/parent-company-table-columns.tsx'
import { TableSearchInput } from '#/components/admin/common/TableSearchInput.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { useDebouncedValue } from '#/hooks/common/use-debounced-value.ts'
import { useParentCompanies } from '#/hooks/parent-company/use-parent-companies.ts'
import { useParentCompany } from '#/hooks/parent-company/useParentCompany.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { mapParentCompanyDetailToFormValues } from '#/utils/mapParentCompanyDetailToFormValues.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { ParentCompany } from '#/types/parent-company.ts'

const copy = PARENT_COMPANY_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit'

export function EditParentCompanyPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedParentCompanyId, setSelectedParentCompanyId] = useState<
    string | null
  >(null)
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
    data: parentCompaniesResult,
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
    isFetching,
    refetch,
  } = useParentCompanies(
    {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
    activeSearch,
  )

  const {
    data: parentCompanyDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useParentCompany(selectedParentCompanyId ?? undefined)

  const allParentCompanies = parentCompaniesResult?.items ?? []

  const filteredParentCompanies = useMemo(() => {
    if (!activeSearch.trim()) return allParentCompanies
    const term = activeSearch.trim().toLowerCase()
    return allParentCompanies.filter((company) =>
      company.name.toLowerCase().includes(term),
    )
  }, [allParentCompanies, activeSearch])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const columns = useMemo(
    () =>
      getParentCompanyTableColumns({
        onView: (company: ParentCompany) => {
          setSelectedParentCompanyId(String(company.id))
          setViewMode('view')
        },
        onEdit: (company: ParentCompany) => {
          setSelectedParentCompanyId(String(company.id))
          setViewMode('edit')
        },
      }),
    [],
  )

  const handleBackToTable = () => {
    setViewMode('table')
    setSelectedParentCompanyId(null)
  }

  const handleEditFromView = () => {
    setViewMode('edit')
  }

  const initialValues = parentCompanyDetail
    ? mapParentCompanyDetailToFormValues(parentCompanyDetail)
    : undefined

  return (
    <main className="page-wrap space-y-6">
      {/* Mode 1: Table View with Search */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          <h1 className="display-title text-3xl font-bold text-slate-900">
            {copy.title}
          </h1>

          <TableSearchInput
            id="parent-company-search-input"
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={handleClearSearch}
            placeholder={copy.searchPlaceholder}
            clearLabel={copy.clearButton}
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

          {/* Parent Company Table */}
          <ReusableTable
            data={filteredParentCompanies}
            columns={columns}
            loading={isLoadingList}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={parentCompaniesResult?.totalPages}
            rowCount={
              activeSearch
                ? filteredParentCompanies.length
                : (parentCompaniesResult?.totalCount ?? 0)
            }
          />
        </div>
      ) : null}

      {/* Mode 2: View Detail Page */}
      {viewMode === 'view' && selectedParentCompanyId ? (
        <ParentCompanyDetailView
          parentCompanyId={selectedParentCompanyId}
          onBack={handleBackToTable}
          onEdit={handleEditFromView}
          onDeleteSuccess={handleBackToTable}
        />
      ) : null}

      {/* Mode 3: Multi-Step Edit Form */}
      {viewMode === 'edit' && selectedParentCompanyId ? (
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
          <ParentCompanyForm
            key={selectedParentCompanyId}
            mode="edit"
            parentCompanyId={selectedParentCompanyId}
            initialValues={initialValues}
            onBack={handleBackToTable}
            onSuccess={handleBackToTable}
          />
        ) : null
      ) : null}
    </main>
  )
}
