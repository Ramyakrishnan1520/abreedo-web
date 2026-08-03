import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { ReusableTable } from '#/components/table'
import { Button } from '#/components/ui/button.tsx'
import { getCarrierTableColumns } from '#/components/admin/carrier/carrier-table-columns'
import { useCarriers } from '#/hooks/carrier/use-carriers'
import { ROUTES } from '#/static/routes.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Carrier } from '#/types/carrier.ts'

export function CarriersPage() {
  const navigate = useNavigate()
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

  const columns = useMemo(
    () =>
      getCarrierTableColumns({
        onEdit: (carrier: Carrier) => {
          console.log('Edit carrier', carrier.id)
        },
        onDelete: (carrier: Carrier) => {
          console.log('Delete carrier', carrier.id)
        },
      }),
    [],
  )

  return (
    <main className="page-wrap py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="island-kicker">Carriers</p>
          <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
            Carrier Table
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage carrier records with reusable TanStack Table columns,
            pagination, and action controls.
          </p>
        </div>
        <div>
          <Button
            id="new-carrier-btn"
            type="button"
            onClick={() => void navigate({ to: ROUTES.ADMIN_CARRIERS_NEW })}
            className="h-9 rounded-md bg-tan-dark px-6 font-semibold text-white shadow-xs transition-colors hover:bg-tan-dark/90"
          >
            Add Carrier
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {error instanceof Error
                ? error.message
                : 'Unable to load carriers. Please try again.'}
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
