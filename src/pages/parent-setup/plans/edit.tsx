import { useCallback, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, Layers } from 'lucide-react'

import { PlanDetailView } from '#/components/admin/plan/PlanDetailView.tsx'
import { PlanForm } from '#/components/admin/plan/PlanForm.tsx'
import { getPlanTableColumns } from '#/components/admin/plan/plan-table-columns.tsx'
import { PlanTableFilters } from '#/components/admin/plan/plan-table-filters.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { usePlans } from '#/hooks/plan/use-plans.ts'
import { usePlan } from '#/hooks/plan/usePlanById.ts'
import { useDeletePlan } from '#/hooks/plan/useDeletePlan.ts'
import { DeleteConfirmBanner } from '#/components/admin/common/DeleteConfirmBanner.tsx'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { mapPlanDetailToFormValues } from '#/utils/mapPlanDetailToFormValues.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Plan } from '#/types/plan.ts'

const copy = PLAN_CONTENT.pages.edit

type ViewMode = 'table' | 'view' | 'edit'

export function EditPlanPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [parentCompanyId, setParentCompanyId] = useState<string | undefined>()
  const [carrierId, setCarrierId] = useState<string | undefined>()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

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

  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlan()

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

  const handleParentCompanyChange = useCallback((id: string | undefined) => {
    setParentCompanyId(id)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleCarrierChange = useCallback((id: string | undefined) => {
    setCarrierId(id)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleDeletePlan = (id: string) => {
    deletePlan(id, {
      onSuccess: () => {
        setDeletingPlanId(null)
      },
      onError: () => {
        setDeletingPlanId(null)
      },
    })
  }

  const handleClearAll = () => {
    setSearchTerm('')
    setActiveSearch('')
    setParentCompanyId(undefined)
    setCarrierId(undefined)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const hasActiveFiltersOrSearch = Boolean(
    parentCompanyId || carrierId || activeSearch || searchTerm,
  )

  const columns = useMemo(
    () =>
      getPlanTableColumns({
        onView: (plan: Plan) => {
          setSelectedPlanId(String(plan.id))
          setViewMode('view')
        },
        onEdit: (plan: Plan) => {
          setSelectedPlanId(String(plan.id))
          setViewMode('edit')
        },
        onDelete: (plan: Plan) => {
          setDeletingPlanId(String(plan.id))
        },
      }),
    [],
  )

  const handleBackToTable = () => {
    setViewMode('table')
    setSelectedPlanId(null)
  }

  const handleEditFromView = () => {
    setViewMode('edit')
  }

  const initialValues =
    planDetail ? mapPlanDetailToFormValues(planDetail) : undefined

  return (
    <main className="page-wrap mx-auto max-w-5xl space-y-6 py-8">
      {/* Top Header */}
      <div className="space-y-2">
        <p className="island-kicker">{copy.kicker}</p>
      </div>

      {/* Mode 1: Table View with Search & Filters */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          {/* Search & Filter Card */}
          <Card className="overflow-hidden border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-linear-to-br from-tan-light/30 via-white to-white pb-4">
              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-tan-dark/15 bg-white text-tan-dark shadow-xs">
                  <Layers className="size-5" aria-hidden />
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
              <PlanTableFilters
                parentCompanyId={parentCompanyId}
                carrierId={carrierId}
                searchTerm={searchTerm}
                onParentCompanyChange={handleParentCompanyChange}
                onCarrierChange={handleCarrierChange}
                onSearchTermChange={setSearchTerm}
                onSearchSubmit={handleSearchSubmit}
                onClearSearch={handleClearSearch}
                onClearAll={handleClearAll}
                hasActiveFiltersOrSearch={hasActiveFiltersOrSearch}
              />
            </CardContent>
          </Card>

          {/* Delete Dialog Banner */}
          {deletingPlanId ? (
            <DeleteConfirmBanner
              title={copy.confirmDeleteTitle}
              prompt={copy.confirmDeletePrompt}
              cancelLabel={copy.cancel}
              confirmLabel={copy.confirmDelete}
              isDeleting={isDeleting}
              onCancel={() => setDeletingPlanId(null)}
              onConfirm={() => handleDeletePlan(deletingPlanId)}
            />
          ) : null}

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
