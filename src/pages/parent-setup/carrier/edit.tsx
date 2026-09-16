import { useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { CarrierDetailView } from '#/components/admin/carrier/CarrierDetailView.tsx'
import { CarrierForm } from '#/components/admin/carrier/CarrierForm.tsx'
import { getCarrierTableColumns } from '#/components/admin/carrier/carrier-table-columns.tsx'
import { TableSearchInput } from '#/components/admin/common/TableSearchInput.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { useDebouncedValue } from '#/hooks/common/use-debounced-value.ts'
import { useCarriers } from '#/hooks/carrier/use-carriers.ts'
import { useCarrier } from '#/hooks/carrier/useCarrierById.ts'
import { Route } from '#/routes/_authenticated/admin/parent-setup/carriers/edit.tsx'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { mapCarrierDetailToFormValues } from '#/utils/mapCarrierDetailToFormValues.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Carrier } from '#/types/carrier.ts'

const copy = CARRIER_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit'

export function EditCarrierPage() {
  const { carrierId, mode } = Route.useSearch()
  const navigate = Route.useNavigate()

  const viewMode: ViewMode = (mode as ViewMode) || 'table'
  const selectedCarrierId = carrierId ?? null

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
    data: carriersResult,
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
    isFetching,
    refetch,
  } = useCarriers(
    {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
    activeSearch,
  )

  const {
    data: carrierDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useCarrier(selectedCarrierId ?? undefined)

  const allCarriers = carriersResult?.items ?? []

  const filteredCarriers = useMemo(() => {
    if (!activeSearch.trim()) return allCarriers
    const term = activeSearch.trim().toLowerCase()
    return allCarriers.filter(
      (carrier) =>
        carrier.name.toLowerCase().includes(term) ||
        (carrier.groupNumber?.toLowerCase().includes(term) ?? false),
    )
  }, [allCarriers, activeSearch])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const columns = useMemo(
    () =>
      getCarrierTableColumns({
        onView: (carrier: Carrier) => {
          void navigate({
            search: (prev) => ({
              ...prev,
              carrierId: String(carrier.id),
              mode: 'view',
            }),
          })
        },
        onEdit: (carrier: Carrier) => {
          void navigate({
            search: (prev) => ({
              ...prev,
              carrierId: String(carrier.id),
              mode: 'edit',
            }),
          })
        },
      }),
    [navigate],
  )

  const handleBackToTable = () => {
    void navigate({
      search: () => ({
        carrierId: undefined,
        mode: 'table',
      }),
    })
  }

  const handleEditFromView = () => {
    void navigate({
      search: (prev) => ({
        ...prev,
        mode: 'edit',
      }),
    })
  }

  const initialValues =
    carrierDetail ? mapCarrierDetailToFormValues(carrierDetail) : undefined

  return (
    <main className="page-wrap space-y-6">
      {/* Mode 1: Table View with Search */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          <h1 className="display-title text-3xl font-bold text-slate-900">
            {copy.title}
          </h1>

          <TableSearchInput
            id="carrier-search-input"
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

          {/* Carrier Table */}
          <ReusableTable
            data={filteredCarriers}
            columns={columns}
            loading={isLoadingList}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={carriersResult?.totalPages}
            rowCount={
              activeSearch
                ? filteredCarriers.length
                : (carriersResult?.totalCount ?? 0)
            }
          />
        </div>
      ) : null}

      {/* Mode 2: View Detail Page */}
      {viewMode === 'view' && selectedCarrierId ? (
        <CarrierDetailView
          carrierId={selectedCarrierId}
          onBack={handleBackToTable}
          onEdit={handleEditFromView}
          onDeleteSuccess={handleBackToTable}
        />
      ) : null}

      {/* Mode 3: Multi-Step Edit Form */}
      {viewMode === 'edit' && selectedCarrierId ? (
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
          <CarrierForm
            key={selectedCarrierId}
            mode="edit"
            carrierId={selectedCarrierId}
            initialValues={initialValues}
            onBack={handleBackToTable}
            onSuccess={handleBackToTable}
          />
        ) : null
      ) : null}
    </main>
  )
}
