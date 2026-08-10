import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { ReusableTable } from '#/components/table'
import { Button } from '#/components/ui/button.tsx'
import { getCarrierTableColumns } from '#/components/admin/carrier/carrier-table-columns'
import { useCarriers } from '#/hooks/carrier/use-carriers'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { ROUTES } from '#/static/routes.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Carrier } from '#/types/carrier.ts'

const copy = CARRIER_CONTENT.list

export function CarriersPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const {
    data: carriersResult,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useCarriers(pagination)
  const carriers = carriersResult?.items ?? []

  const navigate = useNavigate()
  const columns = useMemo(
    () =>
      getCarrierTableColumns({
        onEdit: (_carrier: Carrier) => {
          navigate({ to: ROUTES.ADMIN_CARRIERS_EDIT })
        },
        onDelete: (carrier: Carrier) => {
          console.log('Delete carrier', carrier.id)
        },
      }),
    [navigate],
  )

  return (
    <main className="page-wrap py-8">
      <div className="mb-6">
        <p className="island-kicker">{copy.kicker}</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">{copy.description}</p>
      </div>

      {isError ? (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {error instanceof Error ? error.message : copy.loadErrorFallback}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {copy.retry}
            </Button>
          </div>
        </div>
      ) : null}

      <ReusableTable
        data={carriers}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={carriersResult?.totalPages}
        rowCount={carriersResult?.totalCount ?? 0}
      />
    </main>
  )
}
