import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'

import { PlanDetailView } from '#/components/admin/plan/PlanDetailView.tsx'
import { PlanForm } from '#/components/admin/plan/PlanForm.tsx'
import { getPlanTableColumns } from '#/components/admin/plan/plan-table-columns.tsx'
import { PlanTableFilters } from '#/components/admin/plan/plan-table-filters.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { useDebouncedValue } from '#/hooks/common/use-debounced-value.ts'
import { usePlans } from '#/hooks/plan/use-plans.ts'
import { usePlan } from '#/hooks/plan/usePlanById.ts'
import { Route } from '#/routes/_authenticated/admin/parent-setup/plans/edit.tsx'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { mapPlanDetailToFormValues } from '#/utils/mapPlanDetailToFormValues.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Plan } from '#/types/plan.ts'

const copy = PLAN_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit'

export function EditPlanPage() {
  const { planId, mode } = Route.useSearch()
  const navigate = Route.useNavigate()

  const viewMode: ViewMode = (mode as ViewMode) || 'table'
  const selectedPlanId = planId ?? null

  const [searchTerm, setSearchTerm] = useState('')
  const activeSearch = useDebouncedValue(searchTerm)
  const [parentCompanyId, setParentCompanyId] = useState<string | undefined>()
  const [carrierId, setCarrierId] = useState<string | undefined>()

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
    data: plansResult,
    isLoading: isLoadingList,
    isError: isListError,
    error: listError,
    isFetching,
    refetch,
  } = usePlans({
    pagination,
    parentCompanyId,
    carrierId,
    search: activeSearch,
  })

  const {
    data: planDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = usePlan(selectedPlanId ?? undefined)

  const allPlans = plansResult?.items ?? []

  const filteredPlans = useMemo(() => {
    if (!activeSearch.trim()) return allPlans
    const term = activeSearch.trim().toLowerCase()
    return allPlans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(term) ||
        plan.code.toLowerCase().includes(term) ||
        plan.option.toLowerCase().includes(term) ||
        plan.coverageCodeTitle.toLowerCase().includes(term),
    )
  }, [allPlans, activeSearch])

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleParentCompanyChange = useCallback((id: string | undefined) => {
    setParentCompanyId(id)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleCarrierChange = useCallback((id: string | undefined) => {
    setCarrierId(id)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const columns = useMemo(
    () =>
      getPlanTableColumns({
        onView: (plan: Plan) => {
          void navigate({
            search: (prev) => ({
              ...prev,
              planId: String(plan.id),
              mode: 'view',
            }),
          })
        },
        onEdit: (plan: Plan) => {
          void navigate({
            search: (prev) => ({
              ...prev,
              planId: String(plan.id),
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
        planId: undefined,
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
    planDetail ? mapPlanDetailToFormValues(planDetail) : undefined

  return (
    <main className="page-wrap space-y-6">
      {/* Mode 1: Table View with Search & Filters */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          <h1 className="display-title text-3xl font-bold text-slate-900">
            {copy.title}
          </h1>

          <PlanTableFilters
            parentCompanyId={parentCompanyId}
            carrierId={carrierId}
            searchTerm={searchTerm}
            onParentCompanyChange={handleParentCompanyChange}
            onCarrierChange={handleCarrierChange}
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

          {/* Plan Table */}
          <ReusableTable
            data={filteredPlans}
            columns={columns}
            loading={isLoadingList}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={plansResult?.totalPages}
            rowCount={
              activeSearch
                ? filteredPlans.length
                : (plansResult?.totalCount ?? 0)
            }
          />
        </div>
      ) : null}

      {/* Mode 2: View Detail Page */}
      {viewMode === 'view' && selectedPlanId ? (
        <PlanDetailView
          planId={selectedPlanId}
          onBack={handleBackToTable}
          onEdit={handleEditFromView}
          onDeleteSuccess={handleBackToTable}
        />
      ) : null}

      {/* Mode 3: Multi-Step Edit Form */}
      {viewMode === 'edit' && selectedPlanId ? (
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
          <PlanForm
            key={selectedPlanId}
            mode="edit"
            planId={selectedPlanId}
            initialValues={initialValues}
            onBack={handleBackToTable}
            onSuccess={handleBackToTable}
          />
        ) : null
      ) : null}
    </main>
  )
}
