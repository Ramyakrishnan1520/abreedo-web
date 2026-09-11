import { useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { TableSearchInput } from '#/components/admin/common/TableSearchInput.tsx'
import { TerminationCodeDetailView } from '#/components/admin/termination-code/TerminationCodeDetailView.tsx'
import { TerminationCodeForm } from '#/components/admin/termination-code/TerminationCodeForm.tsx'
import { getTerminationCodeTableColumns } from '#/components/admin/termination-code/termination-code-table-columns.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { useDebouncedValue } from '#/hooks/common/use-debounced-value.ts'
import { useTerminationCodes } from '#/hooks/termination-code/use-termination-codes.ts'
import { useTerminationCodeById } from '#/hooks/termination-code/useTerminationCodeById.ts'
import { mapTerminationCodeDetailToFormValues } from '#/utils/mapTerminationCodeDetailToFormValues.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { TerminationCode } from '#/types/termination-code.ts'

const copy = TERMINATION_CODE_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit'

export function EditTerminationCodePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedTerminationCodeId, setSelectedTerminationCodeId] = useState<
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
    data: result,
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
    isFetching,
    refetch,
  } = useTerminationCodes(
    {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
    activeSearch,
  )

  const {
    data: detail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useTerminationCodeById(selectedTerminationCodeId ?? undefined)

  const allItems = result?.items ?? []

  const filteredItems = useMemo(() => {
    if (!activeSearch.trim()) return allItems
    const term = activeSearch.trim().toLowerCase()
    return allItems.filter(
      (item) =>
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term),
    )
  }, [allItems, activeSearch])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const columns = useMemo(
    () =>
      getTerminationCodeTableColumns({
        onView: (item: TerminationCode) => {
          setSelectedTerminationCodeId(String(item.id))
          setViewMode('view')
        },
        onEdit: (item: TerminationCode) => {
          setSelectedTerminationCodeId(String(item.id))
          setViewMode('edit')
        },
      }),
    [],
  )

  const handleBackToTable = () => {
    setViewMode('table')
    setSelectedTerminationCodeId(null)
  }

  const handleEditFromView = () => {
    setViewMode('edit')
  }

  const initialValues = detail
    ? mapTerminationCodeDetailToFormValues(detail)
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
            id="termination-code-search-input"
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

          {/* Termination Code Table */}
          <ReusableTable
            data={filteredItems}
            columns={columns}
            loading={isLoadingList}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={result?.totalPages}
            rowCount={
              activeSearch ? filteredItems.length : (result?.totalCount ?? 0)
            }
          />
        </div>
      ) : null}

      {/* Mode 2: View Detail Page */}
      {viewMode === 'view' && selectedTerminationCodeId ? (
        <TerminationCodeDetailView
          terminationCodeId={selectedTerminationCodeId}
          onBack={handleBackToTable}
          onEdit={handleEditFromView}
          onDeleteSuccess={handleBackToTable}
        />
      ) : null}

      {/* Mode 3: Multi-Step Edit Form */}
      {viewMode === 'edit' && selectedTerminationCodeId ? (
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
          <TerminationCodeForm
            key={selectedTerminationCodeId}
            mode="edit"
            terminationCodeId={selectedTerminationCodeId}
            initialValues={initialValues}
            onBack={handleBackToTable}
            onSuccess={handleBackToTable}
          />
        ) : null
      ) : null}
    </main>
  )
}
