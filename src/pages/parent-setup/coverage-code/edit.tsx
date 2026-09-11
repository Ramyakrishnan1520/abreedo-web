import { useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { CoverageCodeDetailView } from '#/components/admin/coverage-code/CoverageCodeDetailView.tsx'
import { CoverageCodeForm } from '#/components/admin/coverage-code/CoverageCodeForm.tsx'
import { getCoverageCodeTableColumns } from '#/components/admin/coverage-code/coverage-code-table-columns.tsx'
import { TableSearchInput } from '#/components/admin/common/TableSearchInput.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { useDebouncedValue } from '#/hooks/common/use-debounced-value.ts'
import { useCoverageCodes } from '#/hooks/coverage-code/use-coverage-codes.ts'
import { useCoverageCodeById } from '#/hooks/coverage-code/useCoverageCodeById.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { mapCoverageCodeDetailToFormValues } from '#/utils/mapCoverageCodeDetailToFormValues.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { CoverageCode } from '#/types/coverage-code.ts'

const copy = COVERAGE_CODE_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit'

export function EditCoverageCodePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedCoverageCodeId, setSelectedCoverageCodeId] = useState<
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
    data: coverageCodesResult,
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
    isFetching,
    refetch,
  } = useCoverageCodes(
    {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
    activeSearch,
  )

  const {
    data: coverageCodeDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useCoverageCodeById(selectedCoverageCodeId ?? undefined)

  const allCoverageCodes = coverageCodesResult?.items ?? []

  const filteredCoverageCodes = useMemo(() => {
    if (!activeSearch.trim()) return allCoverageCodes
    const term = activeSearch.trim().toLowerCase()
    return allCoverageCodes.filter(
      (codeItem) =>
        codeItem.code.toLowerCase().includes(term) ||
        codeItem.description.toLowerCase().includes(term),
    )
  }, [allCoverageCodes, activeSearch])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const columns = useMemo(
    () =>
      getCoverageCodeTableColumns({
        onView: (coverageCode: CoverageCode) => {
          setSelectedCoverageCodeId(String(coverageCode.id))
          setViewMode('view')
        },
        onEdit: (coverageCode: CoverageCode) => {
          setSelectedCoverageCodeId(String(coverageCode.id))
          setViewMode('edit')
        },
      }),
    [],
  )

  const handleBackToTable = () => {
    setViewMode('table')
    setSelectedCoverageCodeId(null)
  }

  const handleEditFromView = () => {
    setViewMode('edit')
  }

  const initialValues =
    coverageCodeDetail
      ? mapCoverageCodeDetailToFormValues(coverageCodeDetail)
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
            id="coverage-code-search-input"
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

          {/* Coverage Code Table */}
          <ReusableTable
            data={filteredCoverageCodes}
            columns={columns}
            loading={isLoadingList}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={coverageCodesResult?.totalPages}
            rowCount={
              activeSearch
                ? filteredCoverageCodes.length
                : (coverageCodesResult?.totalCount ?? 0)
            }
          />
        </div>
      ) : null}

      {/* Mode 2: View Detail Page */}
      {viewMode === 'view' && selectedCoverageCodeId ? (
        <CoverageCodeDetailView
          coverageCodeId={selectedCoverageCodeId}
          onBack={handleBackToTable}
          onEdit={handleEditFromView}
          onDeleteSuccess={handleBackToTable}
        />
      ) : null}

      {/* Mode 3: Multi-Step Edit Form */}
      {viewMode === 'edit' && selectedCoverageCodeId ? (
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
          <CoverageCodeForm
            key={selectedCoverageCodeId}
            mode="edit"
            coverageCodeId={selectedCoverageCodeId}
            initialValues={initialValues}
            onBack={handleBackToTable}
            onSuccess={handleBackToTable}
          />
        ) : null
      ) : null}
    </main>
  )
}
