import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { getPlanTableColumns } from '#/components/admin/plan/plan-table-columns.tsx'
import { PlanTableFilters } from '#/components/admin/plan/plan-table-filters.tsx'
import { ReusableTable } from '#/components/table'
import { Button } from '#/components/ui/button.tsx'
import { usePlans } from '#/hooks/plan/use-plans.ts'
import { ROUTES } from '#/static/routes.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Plan } from '#/types/plan.ts'

const copy = PLAN_CONTENT.list

export function PlansPage() {
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [parentCompanyId, setParentCompanyId] = useState<string | undefined>()
  const [carrierId, setCarrierId] = useState<string | undefined>()

  const handleParentCompanyChange = useCallback((id: string | undefined) => {
    setParentCompanyId(id)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleCarrierChange = useCallback((id: string | undefined) => {
    setCarrierId(id)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const {
    data: plansResult,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = usePlans({
    pagination,
    parentCompanyId,
    carrierId,
  })

  const plans = plansResult?.items ?? []

  const columns = useMemo(
    () =>
      getPlanTableColumns({
        onEdit: (plan: Plan) => {
          console.log('Edit plan', plan.id)
        },
        onDelete: (plan: Plan) => {
          console.log('Delete plan', plan.id)
        },
      }),
    [],
  )

  return (
    <main className="page-wrap py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="island-kicker">{copy.kicker}</p>
          <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">{copy.description}</p>
        </div>
        <div>
          <Button
            id="new-plan-btn"
            type="button"
            onClick={() => void navigate({ to: ROUTES.ADMIN_PLANS_NEW })}
            className="h-9 rounded-md bg-tan-dark px-6 font-semibold text-white shadow-xs transition-colors hover:bg-tan-dark/90 cursor-pointer"
          >
            {copy.addButton}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <PlanTableFilters
          parentCompanyId={parentCompanyId}
          carrierId={carrierId}
          onParentCompanyChange={handleParentCompanyChange}
          onCarrierChange={handleCarrierChange}
        />
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
        data={plans}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={plansResult?.totalPages}
        rowCount={plansResult?.totalCount ?? 0}
      />
    </main>
  )
}
