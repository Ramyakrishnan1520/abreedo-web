import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, Building2, Search, X } from 'lucide-react'

import { EmployerDetailView } from '#/components/admin/employer/EmployerDetailView.tsx'
import { EmployerForm } from '#/components/admin/employer/EmployerForm.tsx'
import { getEmployerTableColumns } from '#/components/admin/employer/employer-table-columns.tsx'
import { FORM_INPUT_CLASS } from '#/components/admin/common/form-styles.ts'
import { ReusableTable } from '#/components/table'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Input } from '#/components/ui/input.tsx'
import { useEmployers } from '#/hooks/employer/use-employers.ts'
import { useEmployer } from '#/hooks/employer/useEmployerById.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { mapEmployerDetailToFormValues } from '#/utils/mapEmployerDetailToFormValues.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Employer } from '#/types/employer.ts'

const copy = EMPLOYER_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit'

export function EditEmployerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const {
    data: employersResult,
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
    isFetching,
    refetch,
  } = useEmployers(
    undefined,
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

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setActiveSearch(searchTerm)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setActiveSearch('')
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const columns = useMemo(
    () =>
      getEmployerTableColumns({
        onView: (employer: Employer) => {
          setSelectedEmployerId(String(employer.id))
          setViewMode('view')
        },
        onEdit: (employer: Employer) => {
          setSelectedEmployerId(String(employer.id))
          setViewMode('edit')
        },
      }),
    [],
  )

  const handleBackToTable = () => {
    setViewMode('table')
    setSelectedEmployerId(null)
  }

  const handleEditFromView = () => {
    setViewMode('edit')
  }

  const initialValues = employerDetail
    ? mapEmployerDetailToFormValues(employerDetail)
    : undefined

  return (
    <main className="page-wrap mx-auto max-w-5xl space-y-6 py-8">
      {/* Top Header */}
      <div className="space-y-2">
        <p className="island-kicker">{copy.kicker}</p>
      </div>

      {/* Table View with Search */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          {/* Search Card */}
          <Card className="overflow-hidden border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-linear-to-br from-tan-light/30 via-white to-white pb-4">
              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-tan-dark/15 bg-white text-tan-dark shadow-xs">
                  <Building2 className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {copy.selectLabel}
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    {copy.selectCardDescription}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <Input
                    id="employer-search-input"
                    type="text"
                    placeholder={copy.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={FORM_INPUT_CLASS}
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={copy.clearButton}
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                </div>
                <Button
                  id="employer-search-btn"
                  type="submit"
                  className="h-10 gap-2 bg-tan-dark font-semibold text-white shadow-xs hover:bg-tan-dark/90"
                >
                  <Search className="size-4" />
                  {copy.searchButton}
                </Button>
              </form>
            </CardContent>
          </Card>

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
          onEdit={handleEditFromView}
          onDeleteSuccess={handleBackToTable}
        />
      ) : null}

      {/* Multi-Step Edit Form */}
      {viewMode === 'edit' && selectedEmployerId ? (
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
            key={selectedEmployerId}
            mode="edit"
            employerId={selectedEmployerId}
            initialValues={initialValues}
            onBack={handleBackToTable}
            onSuccess={handleBackToTable}
          />
        ) : null
      ) : null}
    </main>
  )
}
