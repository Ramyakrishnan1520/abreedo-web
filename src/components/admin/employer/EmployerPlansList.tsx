import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  ChevronRight,
  Pencil,
  Plus,
} from 'lucide-react'

import { EmployerForm } from '#/components/admin/employer/EmployerForm.tsx'
import { EmployerRatesTable } from '#/components/admin/employer/EmployerRatesTable.tsx'
import { ReusableTable } from '#/components/table/index.ts'
import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#/components/ui/dialog.tsx'
import { useCarrierGroupNumbers } from '#/hooks/employer/useCarrierGroupNumbers.ts'
import { useEmployer } from '#/hooks/employer/useEmployerById.ts'
import { useEmployerPlans } from '#/hooks/employer/useEmployerPlans.ts'
import { cn } from '#/lib/utils.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { mapCarrierGroupNumberToFormValues } from '#/utils/mapCarrierGroupNumberToFormValues.ts'
import { mapEmployerDetailToFormValues } from '#/utils/mapEmployerDetailToFormValues.ts'

import type { ConfiguredEmployerPlan } from '#/components/admin/employer/employer.schema.ts'
import type { ColumnDef, ExpandedState, OnChangeFn, PaginationState } from '@tanstack/react-table'
import type { CarrierGroupNumberItem, PlanRateItem } from '#/types/employer.ts'

interface EmployerPlansListProps {
  employerId: string
  employerName: string
  parentCompanyName?: string
  parentCompanyId?: string
  carrierIds?: string[]
  employerGroupId?: string
  onBack: () => void
}

const copy = EMPLOYER_CONTENT.pages.plansList
const planStepCopy = EMPLOYER_CONTENT.planStep
const { form: formCopy } = EMPLOYER_CONTENT

export function EmployerPlansList({
  employerId,
  employerName,
  parentCompanyName,
  employerGroupId,
  onBack,
}: EmployerPlansListProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Accordion row expansion state for ReusableTable
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const handleExpandedChange: OnChangeFn<ExpandedState> = (updaterOrValue) => {
    setExpanded((old) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
      if (typeof next === 'object' && next !== null) {
        const keys = Object.keys(next).filter((k) => next[k])
        if (keys.length > 1) {
          const lastKey = keys[keys.length - 1]
          return lastKey ? { [lastKey]: true } : {}
        }
        return next
      }
      return next
    })
  }

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedPlanForModal, setSelectedPlanForModal] =
    useState<CarrierGroupNumberItem | null>(null)

  const {
    data: plansResult,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCarrierGroupNumbers(employerGroupId, {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })

  // Fetch full employer details and configured employer plans (with rates)
  const { data: employerDetail } = useEmployer(employerId)
  const { data: allEmployerPlansResponse } = useEmployerPlans(employerId)

  const selectedCgnId =
    selectedPlanForModal?.carrierGroupNumberId || selectedPlanForModal?.id

  const {
    data: fetchedPlanResponse,
    isLoading: isLoadingPlanDetail,
  } = useEmployerPlans(
    isModalOpen && modalMode === 'edit' ? employerId : undefined,
    selectedCgnId || undefined,
  )

  const detailedPlan = fetchedPlanResponse?.items?.[0]

  const emptyValue = copy.emptyValue

  const displayPlanName = (item: CarrierGroupNumberItem) =>
    item.planName || item.name || emptyValue

  const displayCoverageCode = (item: CarrierGroupNumberItem) =>
    item.coverageCodeTitle ||
    item.coverageCode ||
    item.coverageCodeName ||
    emptyValue

  const displayOption = (item: CarrierGroupNumberItem) =>
    item.option || emptyValue

  const displayGroupNumber = (item: CarrierGroupNumberItem) =>
    item.groupNumber || item.cgnGroupNumber || emptyValue

  /**
   * Resolves configured rate tiers for a plan row strictly using its planId
   */
  const getRatesForPlan = (planId?: string): PlanRateItem[] => {
    if (!planId) return []

    // Match by planId in employer's configured plans
    const matchedPlan = allEmployerPlansResponse?.items?.find(
      (p) => p.planId === planId,
    )
    if (matchedPlan?.planRates && matchedPlan.planRates.length > 0) {
      return matchedPlan.planRates
    }

    // Fallback: match by planId on employerDetail root
    if (
      employerDetail?.planId === planId &&
      employerDetail?.planRates &&
      employerDetail.planRates.length > 0
    ) {
      return employerDetail.planRates
    }

    return []
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setSelectedPlanForModal(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (plan: CarrierGroupNumberItem) => {
    setModalMode('edit')
    setSelectedPlanForModal(plan)
    setIsModalOpen(true)
  }

  const initialValues = useMemo(() => {
    if (!employerDetail) return undefined
    return mapEmployerDetailToFormValues(employerDetail)
  }, [employerDetail])

  const existingPlanIds = useMemo(
    () =>
      (plansResult?.items ?? [])
        .map((item) => item.planId)
        .filter((id): id is string => Boolean(id)),
    [plansResult?.items],
  )

  const modalInitialValues = useMemo(() => {
    if (!initialValues) return undefined

    if (modalMode === 'add') {
      return {
        ...initialValues,
        planId: '',
        planName: '',
        cgnGroupNumber: '',
        billerAccountNumber: '',
        cgnCustomerNumber: '',
        brokerCodeId: '',
        brokerCodeName: '',
        isActive: true,
        planRates: [],
        plans: [],
        existingPlanIds,
      }
    }

    const planItem = detailedPlan || selectedPlanForModal
    if (planItem) {
      const mapped = mapCarrierGroupNumberToFormValues(planItem)
      const configuredPlanItem: ConfiguredEmployerPlan = {
        id: planItem.carrierGroupNumberId || planItem.id || 'single-plan',
        planId: mapped.planId || '',
        planName: mapped.planName || '',
        cgnGroupNumber: mapped.cgnGroupNumber || '',
        billerAccountNumber: mapped.billerAccountNumber || '',
        cgnCustomerNumber: mapped.cgnCustomerNumber || '',
        brokerCodeId: mapped.brokerCodeId || '',
        brokerCodeName: mapped.brokerCodeName || '',
        isActive: mapped.isActive ?? true,
        rates: mapped.planRates ?? [],
      }
      return {
        ...initialValues,
        ...mapped,
        plans: [configuredPlanItem],
        existingPlanIds,
      }
    }

    return {
      ...initialValues,
      existingPlanIds,
    }
  }, [initialValues, modalMode, detailedPlan, selectedPlanForModal, existingPlanIds])

  const columns = useMemo<ColumnDef<CarrierGroupNumberItem>[]>(
    () => [
      {
        id: 'expander',
        header: () => <span className="w-10" />,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              row.toggleExpanded()
            }}
            className="inline-flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-transform cursor-pointer"
            aria-expanded={row.getIsExpanded()}
            aria-label={
              row.getIsExpanded()
                ? planStepCopy.collapseRatesAria
                : planStepCopy.expandRatesAria
            }
          >
            <ChevronRight
              className={cn(
                'size-4 transition-transform duration-200',
                row.getIsExpanded() && 'rotate-90 text-tan-dark',
              )}
            />
          </button>
        ),
      },
      {
        accessorKey: 'planName',
        header: copy.columns.plan,
        cell: ({ row }) => (
          <span className="font-medium text-slate-900">
            {displayPlanName(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'coverageCode',
        header: copy.columns.coverageCode,
        cell: ({ row }) => (
          <span className="text-slate-700">
            {displayCoverageCode(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'option',
        header: copy.columns.option,
        cell: ({ row }) => (
          <span className="text-slate-700">
            {displayOption(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'groupNumber',
        header: copy.columns.groupNumber,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-700">
            {displayGroupNumber(row.original)}
          </span>
        ),
      },
      {
        id: 'action',
        header: () => <span className="block text-right">{copy.columns.action}</span>,
        cell: ({ row }) => {
          const planName = displayPlanName(row.original)
          return (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={copy.editAria(planName)}
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenEdit(row.original)
                }}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Pencil className="size-3.5" />
              </Button>
            </div>
          )
        },
      },
    ],
    [],
  )

  const plans = plansResult?.items ?? []

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <Card className="overflow-hidden border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 bg-linear-to-br from-tan-light/30 via-white to-white pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-tan-dark/15 bg-white text-tan-dark shadow-xs">
                <Building2 className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {copy.title}
                  </CardTitle>
                  <Badge variant="outline" className="font-medium text-slate-700">
                    {employerName}
                  </Badge>
                  {parentCompanyName ? (
                    <Badge variant="secondary" className="font-medium">
                      {parentCompanyName}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">{copy.description}</p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <Button
                type="button"
                size="sm"
                onClick={handleOpenAdd}
                className="h-9 gap-1.5 bg-tan-dark text-white hover:bg-tan-dark/90 cursor-pointer"
              >
                <Plus className="size-4" />
                {copy.addPlanButton}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Error Banner */}
          {isError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  {error instanceof Error ? error.message : copy.error}
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

          {/* ReusableTable with expandable rows and accordion rates support */}
          <ReusableTable
            data={plans}
            columns={columns}
            loading={isLoading}
            pagination={pagination}
            onPaginationChange={(updater) => {
              setExpanded({})
              setPagination(updater)
            }}
            pageCount={plansResult?.totalPages}
            rowCount={plansResult?.totalCount}
            expanded={expanded}
            onExpandedChange={handleExpandedChange}
            onRowClick={(row) => row.toggleExpanded()}
            renderExpandedRow={(row) => {
              const rates = getRatesForPlan(row.original.planId)

              return (
                <div className="p-3 pl-12 sm:pl-14">
                  {rates.length > 0 ? (
                    <EmployerRatesTable
                      rates={rates}
                      className="border-slate-200/80 bg-white shadow-none"
                    />
                  ) : (
                    <p className="py-2 text-xs italic text-slate-400">
                      {planStepCopy.noRatesForPlan}
                    </p>
                  )}
                </div>
              )
            }}
          />

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-start pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              className="h-9 gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              {copy.backButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Add / Edit Modal Dialog containing the exact EmployerForm */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden p-0 rounded-2xl border border-slate-200 bg-white flex flex-col"
          closeClassName="top-5 right-5 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <DialogTitle className="sr-only">
            {modalMode === 'add'
              ? formCopy.titles.addPlan
              : formCopy.titles.editPlan}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {modalMode === 'add'
              ? copy.modal.descriptionAdd
              : copy.modal.descriptionEdit}
          </DialogDescription>

          {isLoadingPlanDetail && modalMode === 'edit' ? (
            <div className="flex flex-1 items-center justify-center gap-3 py-20 text-sm text-slate-600">
              <span className="size-4 animate-spin rounded-full border-2 border-tan-dark border-t-transparent" />
              {EMPLOYER_CONTENT.pages.edit.loadingDetails}
            </div>
          ) : (
            <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
              <EmployerForm
                key={`${employerId}-${modalMode}-${selectedCgnId || 'new'}-${detailedPlan?.planId || selectedPlanForModal?.planId || 'item'}`}
                mode={modalMode === 'add' ? 'add-plan' : 'edit-plan'}
                employerId={employerId}
                initialValues={modalInitialValues}
                className="h-full min-h-0 border-0 rounded-none shadow-none flex flex-col"
                onBack={() => setIsModalOpen(false)}
                onSuccess={() => {
                  setIsModalOpen(false)
                  void refetch()
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
