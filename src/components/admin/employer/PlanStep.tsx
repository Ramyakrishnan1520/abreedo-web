import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AlertCircle, Plus } from 'lucide-react'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import { EmployerPlanTable } from '#/components/admin/employer/EmployerPlanTable.tsx'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { Button } from '#/components/ui/button.tsx'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import { Input } from '#/components/ui/input.tsx'
import { useInfinitePlans } from '#/hooks/plan/use-infinite-plans.ts'
import { useInfiniteBrokerCodes } from '#/hooks/broker-code/use-infinite-broker-codes.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type {
  ConfiguredEmployerPlan,
  EmployerFormValues,
} from '#/components/admin/employer/employer.schema.ts'
import type { EmployerFormMode } from '#/utils/getEmployerStepValidationFields.ts'

const copy = EMPLOYER_CONTENT.planStep

export interface EmployerPlanStepProps {
  mode?: EmployerFormMode
}

export function PlanStep({ mode = 'create' }: EmployerPlanStepProps = {}) {
  const form = useFormContext<EmployerFormValues>()
  const values = form.watch()
  const isSinglePlanEdit = mode === 'edit-plan'

  const plans = form.watch('plans') ?? []

  const {
    data: plansData,
    isLoading: isLoadingPlans,
    isFetchingNextPage: isFetchingNextPlansPage,
    hasNextPage: hasNextPlansPage,
    fetchNextPage: fetchNextPlansPage,
  } = useInfinitePlans({
    parentCompanyId: values.parentCompanyId,
    carrierIds: values.carrierIds,
  })

  const [planSelectContent, setPlanSelectContent] =
    useState<HTMLDivElement | null>(null)
  const [planSelectOpen, setPlanSelectOpen] = useState(false)

  const planLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: hasNextPlansPage,
    isFetchingNextPage: isFetchingNextPlansPage,
    fetchNextPage: fetchNextPlansPage,
    enabled: planSelectOpen,
    root: planSelectContent,
  })

  const {
    data: brokerCodesData,
    isLoading: isLoadingBrokerCodes,
    isFetchingNextPage: isFetchingNextBrokerCodesPage,
    hasNextPage: hasNextBrokerCodesPage,
    fetchNextPage: fetchNextBrokerCodesPage,
  } = useInfiniteBrokerCodes()

  const [brokerCodeSelectContent, setBrokerCodeSelectContent] =
    useState<HTMLDivElement | null>(null)
  const [brokerCodeSelectOpen, setBrokerCodeSelectOpen] = useState(false)

  const brokerCodeLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: hasNextBrokerCodesPage,
    isFetchingNextPage: isFetchingNextBrokerCodesPage,
    fetchNextPage: fetchNextBrokerCodesPage,
    enabled: brokerCodeSelectOpen,
    root: brokerCodeSelectContent,
  })

  const allPlans = useMemo(
    () => plansData?.pages.flatMap((page) => page.items) ?? [],
    [plansData],
  )

  const planOptions = useMemo(
    () =>
      allPlans.map((plan) => ({
        value: plan.id,
        label: plan.code ? `${plan.name} (${plan.code})` : plan.name,
      })),
    [allPlans],
  )

  const allBrokerCodes = useMemo(
    () => brokerCodesData?.pages.flatMap((page) => page.items) ?? [],
    [brokerCodesData],
  )

  const brokerCodeOptions = useMemo(
    () =>
      allBrokerCodes.map((broker) => ({
        value: broker.id,
        label: broker.code ? `${broker.name} (${broker.code})` : broker.name,
      })),
    [allBrokerCodes],
  )

  // Track draft values for the input fields
  const [draftPlanId, setDraftPlanId] = useState<string>('')
  const [draftGroupNumber, setDraftGroupNumber] = useState<string>('')
  const [draftBillerAccount, setDraftBillerAccount] = useState<string>('')
  const [draftCustomerNumber, setDraftCustomerNumber] = useState<string>('')
  const [draftBrokerCodeId, setDraftBrokerCodeId] = useState<string>('')
  const [draftIsActive, setDraftIsActive] = useState<boolean>(true)

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isEditingSinglePlan, setIsEditingSinglePlan] = useState<boolean>(false)

  const [errors, setErrors] = useState<{
    planId?: string
    groupNumber?: string
    billerAccount?: string
  }>({})

  const effectivePlanId = isSinglePlanEdit
    ? draftPlanId || values.planId || ''
    : draftPlanId

  const hasPlanSelected = Boolean(effectivePlanId.trim())
  const showAdditionalFields = isSinglePlanEdit
    ? isEditingSinglePlan
    : hasPlanSelected

  const selectedDraftPlanLabel = useMemo(() => {
    if (!effectivePlanId) return ''
    const match = allPlans.find((p) => p.id === effectivePlanId)
    return match
      ? match.code
        ? `${match.name} (${match.code})`
        : match.name
      : (effectivePlanId === values.planId ? values.planName : '') ||
          effectivePlanId
  }, [allPlans, effectivePlanId, values.planId, values.planName])

  const selectedDraftBrokerLabel = useMemo(() => {
    if (!draftBrokerCodeId) return ''
    const match = allBrokerCodes.find((b) => b.id === draftBrokerCodeId)
    return match
      ? match.code
        ? `${match.name} (${match.code})`
        : match.name
      : (draftBrokerCodeId === values.brokerCodeId
          ? values.brokerCodeName
          : '') || draftBrokerCodeId
  }, [
    allBrokerCodes,
    draftBrokerCodeId,
    values.brokerCodeId,
    values.brokerCodeName,
  ])

  const handleAddOrUpdatePlan = () => {
    const currentPlanId = isSinglePlanEdit
      ? draftPlanId || values.planId || ''
      : draftPlanId

    const newErrors: {
      planId?: string
      groupNumber?: string
      billerAccount?: string
    } = {}

    if (!currentPlanId.trim()) {
      newErrors.planId = EMPLOYER_CONTENT.validation.planRequired
    }
    if (!draftGroupNumber.trim()) {
      newErrors.groupNumber = EMPLOYER_CONTENT.validation.cgnGroupNumberRequired
    }
    if (!draftBillerAccount.trim()) {
      newErrors.billerAccount =
        EMPLOYER_CONTENT.validation.billerAccountNumberRequired
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const selectedPlan = allPlans.find((p) => p.id === currentPlanId)
    const selectedBroker = allBrokerCodes.find((b) => b.id === draftBrokerCodeId)
    const resolvedPlanName = selectedPlan
      ? selectedPlan.name
      : selectedDraftPlanLabel || currentPlanId
    const resolvedBrokerName = selectedBroker
      ? selectedBroker.name
      : selectedDraftBrokerLabel || draftBrokerCodeId

    if (isSinglePlanEdit) {
      // Single plan edit mode
      form.setValue('planId', currentPlanId, { shouldValidate: true })
      form.setValue('planName', resolvedPlanName)
      form.setValue('cgnGroupNumber', draftGroupNumber, { shouldValidate: true })
      form.setValue('billerAccountNumber', draftBillerAccount, {
        shouldValidate: true,
      })
      form.setValue('cgnCustomerNumber', draftCustomerNumber, {
        shouldValidate: true,
      })
      form.setValue('brokerCodeId', draftBrokerCodeId, { shouldValidate: true })
      form.setValue('brokerCodeName', resolvedBrokerName)
      form.setValue('isActive', draftIsActive, { shouldValidate: true })
      form.clearErrors(['planId', 'cgnGroupNumber', 'billerAccountNumber'])

      // Clear inputs to collapse back to Plan field + Table
      setDraftPlanId('')
      setDraftGroupNumber('')
      setDraftBillerAccount('')
      setDraftCustomerNumber('')
      setDraftBrokerCodeId('')
      setDraftIsActive(true)
      setIsEditingSinglePlan(false)
      return
    }

    // Multiple plans mode (create or add-plan)
    const newPlanItem: ConfiguredEmployerPlan = {
      id:
        editingIndex !== null
          ? plans[editingIndex]?.id || String(editingIndex)
          : `${draftPlanId}-${Date.now()}`,
      planId: draftPlanId,
      planName: resolvedPlanName,
      cgnGroupNumber: draftGroupNumber,
      billerAccountNumber: draftBillerAccount,
      cgnCustomerNumber: draftCustomerNumber,
      brokerCodeId: draftBrokerCodeId,
      brokerCodeName: resolvedBrokerName,
      isActive: draftIsActive,
      rates: editingIndex !== null ? plans[editingIndex]?.rates ?? [] : [],
    }

    let updatedPlans: ConfiguredEmployerPlan[]
    if (editingIndex !== null) {
      updatedPlans = plans.map((p, idx) =>
        idx === editingIndex ? newPlanItem : p,
      )
      setEditingIndex(null)
    } else {
      updatedPlans = [...plans, newPlanItem]
    }

    form.setValue('plans', updatedPlans, { shouldValidate: true })
    form.clearErrors(['plans'])

    // Clear inputs after adding/updating
    setDraftPlanId('')
    setDraftGroupNumber('')
    setDraftBillerAccount('')
    setDraftCustomerNumber('')
    setDraftBrokerCodeId('')
    setDraftIsActive(true)
  }

  const handleRowClickToEditSinglePlan = () => {
    setDraftPlanId(values.planId || '')
    setDraftGroupNumber(values.cgnGroupNumber || '')
    setDraftBillerAccount(values.billerAccountNumber || '')
    setDraftCustomerNumber(values.cgnCustomerNumber || '')
    setDraftBrokerCodeId(values.brokerCodeId || '')
    setDraftIsActive(values.isActive ?? true)
    setIsEditingSinglePlan(true)
    setErrors({})
  }

  const handleRowClickToEdit = (plan: ConfiguredEmployerPlan, index: number) => {
    setDraftPlanId(plan.planId || '')
    setDraftGroupNumber(plan.cgnGroupNumber || '')
    setDraftBillerAccount(plan.billerAccountNumber || '')
    setDraftCustomerNumber(plan.cgnCustomerNumber || '')
    setDraftBrokerCodeId(plan.brokerCodeId || '')
    setDraftIsActive(plan.isActive ?? true)
    setEditingIndex(index)
    setErrors({})
  }

  const handleDeletePlan = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = plans.filter((_, idx) => idx !== index)
    form.setValue('plans', updated, { shouldValidate: true })
    if (editingIndex === index) {
      setEditingIndex(null)
      setDraftPlanId('')
      setDraftGroupNumber('')
      setDraftBillerAccount('')
      setDraftCustomerNumber('')
      setDraftBrokerCodeId('')
      setDraftIsActive(true)
      setErrors({})
    }
  }

  const handleCancelEdit = () => {
    setDraftPlanId('')
    setDraftGroupNumber('')
    setDraftBillerAccount('')
    setDraftCustomerNumber('')
    setDraftBrokerCodeId('')
    setDraftIsActive(true)
    setEditingIndex(null)
    setIsEditingSinglePlan(false)
    setErrors({})
  }

  const hasConfiguredPlans = isSinglePlanEdit
    ? Boolean(values.planId && values.cgnGroupNumber)
    : plans.length > 0

  return (
    <div className="space-y-8">
      {/* Plan Form Fields */}
      <div className="space-y-6">
        {/* Plan Dropdown */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
          <label htmlFor="plan-select" className={REQUIRED_LABEL_CLASS}>
            {copy.planLabel}
          </label>
          <div className="space-y-1">
            <ConfigurableSelect
              id="plan-select"
              value={effectivePlanId}
              onValueChange={(val) => {
                setDraftPlanId(val)
                if (isSinglePlanEdit) {
                  setIsEditingSinglePlan(true)
                  if (!isEditingSinglePlan) {
                    setDraftGroupNumber(values.cgnGroupNumber || '')
                    setDraftBillerAccount(values.billerAccountNumber || '')
                    setDraftCustomerNumber(values.cgnCustomerNumber || '')
                    setDraftBrokerCodeId(values.brokerCodeId || '')
                    setDraftIsActive(values.isActive ?? true)
                  }
                }
                if (errors.planId)
                  setErrors((prev) => ({ ...prev, planId: undefined }))
              }}
              options={planOptions}
              selectedLabel={selectedDraftPlanLabel}
              placeholder={copy.planPlaceholder}
              loading={isLoadingPlans}
              loadingPlaceholder={copy.planLoadingPlaceholder}
              triggerClassName={FORM_INPUT_CLASS}
              open={planSelectOpen}
              onOpenChange={setPlanSelectOpen}
              onContentRef={setPlanSelectContent}
              loadMoreRef={planLoadMoreRef}
              isFetchingNextPage={isFetchingNextPlansPage}
            />
            {errors.planId ? (
              <p className="text-xs font-medium text-destructive">
                {errors.planId}
              </p>
            ) : null}
          </div>
        </div>

        {/* Additional fields reveal once a Plan is chosen or row is clicked to edit */}
        {showAdditionalFields ? (
          <>
            {/* Group Number */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="plan-group-number" className={REQUIRED_LABEL_CLASS}>
                {copy.groupNumberLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="plan-group-number"
                  placeholder={copy.groupNumberPlaceholder}
                  className={FORM_INPUT_CLASS}
                  value={draftGroupNumber}
                  onChange={(e) => {
                    setDraftGroupNumber(e.target.value)
                    if (errors.groupNumber) {
                      setErrors((prev) => ({
                        ...prev,
                        groupNumber: undefined,
                      }))
                    }
                  }}
                />
                {errors.groupNumber ? (
                  <p className="text-xs font-medium text-destructive">
                    {errors.groupNumber}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Biller Account Number */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label
                htmlFor="plan-biller-account"
                className={REQUIRED_LABEL_CLASS}
              >
                {copy.billerAccountNumberLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="plan-biller-account"
                  placeholder={copy.billerAccountNumberPlaceholder}
                  className={FORM_INPUT_CLASS}
                  value={draftBillerAccount}
                  onChange={(e) => {
                    setDraftBillerAccount(e.target.value)
                    if (errors.billerAccount) {
                      setErrors((prev) => ({
                        ...prev,
                        billerAccount: undefined,
                      }))
                    }
                  }}
                />
                {errors.billerAccount ? (
                  <p className="text-xs font-medium text-destructive">
                    {errors.billerAccount}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Customer Number */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="plan-customer-number" className={LABEL_COL}>
                {copy.customerNumberLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="plan-customer-number"
                  placeholder={copy.customerNumberPlaceholder}
                  className={FORM_INPUT_CLASS}
                  value={draftCustomerNumber}
                  maxLength={10}
                  onChange={(e) => setDraftCustomerNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Broker Code */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="plan-broker-code" className={LABEL_COL}>
                {copy.brokerCodeLabel}
              </label>
              <div className="space-y-1">
                <ConfigurableSelect
                  id="plan-broker-code"
                  value={draftBrokerCodeId}
                  onValueChange={(val) => setDraftBrokerCodeId(val)}
                  options={brokerCodeOptions}
                  selectedLabel={selectedDraftBrokerLabel}
                  placeholder={copy.brokerCodePlaceholder}
                  loading={isLoadingBrokerCodes}
                  loadingPlaceholder={copy.brokerCodeLoadingPlaceholder}
                  triggerClassName={FORM_INPUT_CLASS}
                  open={brokerCodeSelectOpen}
                  onOpenChange={setBrokerCodeSelectOpen}
                  onContentRef={setBrokerCodeSelectContent}
                  loadMoreRef={brokerCodeLoadMoreRef}
                  isFetchingNextPage={isFetchingNextBrokerCodesPage}
                />
              </div>
            </div>

            {/* Is Active */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label className={LABEL_COL}>{copy.isActiveLabel}</label>
              <div className="flex items-center gap-2 pt-0.5 sm:pt-2">
                <Checkbox
                  id="plan-is-active"
                  checked={draftIsActive}
                  onCheckedChange={(checked) =>
                    setDraftIsActive(Boolean(checked))
                  }
                />
                <label
                  htmlFor="plan-is-active"
                  className="cursor-pointer text-sm font-medium text-slate-700"
                >
                  {copy.activeStatus}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {editingIndex !== null || isEditingSinglePlan ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="cursor-pointer"
                >
                  {copy.cancelEditButton}
                </Button>
              ) : null}

              <Button
                type="button"
                onClick={handleAddOrUpdatePlan}
                className="bg-tan-dark hover:bg-tan-dark/90 text-white cursor-pointer"
              >
                {isSinglePlanEdit || editingIndex !== null ? null : (
                  <Plus className="size-4" />
                )}
                {isSinglePlanEdit || editingIndex !== null
                  ? copy.updateButton
                  : copy.addButton}
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {/* Added Plans Summary Table */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        {!hasConfiguredPlans && form.formState.errors.plans ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/75 px-4 py-2.5 text-xs font-medium text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{EMPLOYER_CONTENT.validation.planRequiresAtLeastOne}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {copy.addedPlanHeading}
          </h2>
          {hasConfiguredPlans ? (
            <span className="text-xs text-slate-500">
              {copy.clickRowToEditHint}
            </span>
          ) : null}
        </div>

        {isSinglePlanEdit ? (
          <EmployerPlanTable
            planName={values.planName || values.planId}
            groupNumber={values.cgnGroupNumber}
            billerAccountNumber={values.billerAccountNumber}
            customerNumber={values.cgnCustomerNumber}
            brokerCodeName={values.brokerCodeName || values.brokerCodeId}
            isActive={values.isActive}
            isSelected={isEditingSinglePlan}
            onRowClick={handleRowClickToEditSinglePlan}
            onEdit={handleRowClickToEditSinglePlan}
          />
        ) : (
          <EmployerPlanTable
            plans={plans}
            selectedIndex={editingIndex}
            onRowClick={handleRowClickToEdit}
            onEdit={handleRowClickToEdit}
            onDelete={handleDeletePlan}
          />
        )}
      </div>
    </div>
  )
}
