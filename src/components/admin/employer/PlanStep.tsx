import { useMemo, useState, useEffect } from 'react'
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

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

const copy = EMPLOYER_CONTENT.planStep

export function PlanStep() {
  const form = useFormContext<EmployerFormValues>()
  const values = form.watch()

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
  const [draftPlanId, setDraftPlanId] = useState<string>(values.planId || '')
  const [draftGroupNumber, setDraftGroupNumber] = useState<string>(
    values.cgnGroupNumber || '',
  )
  const [draftBillerAccount, setDraftBillerAccount] = useState<string>(
    values.billerAccountNumber || '',
  )
  const [draftCustomerNumber, setDraftCustomerNumber] = useState<string>(
    values.cgnCustomerNumber || '',
  )
  const [draftBrokerCodeId, setDraftBrokerCodeId] = useState<string>(
    values.brokerCodeId || '',
  )
  const [draftIsActive, setDraftIsActive] = useState<boolean>(
    values.isActive ?? true,
  )

  const [errors, setErrors] = useState<{
    planId?: string
    groupNumber?: string
    billerAccount?: string
  }>({})
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const hasConfiguredPlan = Boolean(values.planId && values.cgnGroupNumber)

  // If a plan is already configured set editing mode to true so the Update button is shown instead of Add.
  useEffect(() => {
    if (hasConfiguredPlan) {
      setIsEditing(true);
    }
  }, [hasConfiguredPlan]);

  // Resolve labels for display in the table
  const selectedPlanLabel = useMemo(() => {
    if (!values.planId) return values.planName || ''
    const match = allPlans.find((p) => p.id === values.planId)
    return match ? (match.code ? `${match.name} (${match.code})` : match.name) : values.planName || values.planId
  }, [allPlans, values.planId, values.planName])

  const selectedBrokerCodeLabel = useMemo(() => {
    if (!values.brokerCodeId) return values.brokerCodeName || '-'
    const match = allBrokerCodes.find((b) => b.id === values.brokerCodeId)
    return match ? (match.code ? `${match.name} (${match.code})` : match.name) : values.brokerCodeName || values.brokerCodeId
  }, [allBrokerCodes, values.brokerCodeId, values.brokerCodeName])

  const selectedDraftPlanLabel = useMemo(() => {
    if (!draftPlanId) return ''
    const match = allPlans.find((p) => p.id === draftPlanId)
    return match ? (match.code ? `${match.name} (${match.code})` : match.name) : values.planName || draftPlanId
  }, [allPlans, draftPlanId, values.planName])

  const selectedDraftBrokerLabel = useMemo(() => {
    if (!draftBrokerCodeId) return ''
    const match = allBrokerCodes.find((b) => b.id === draftBrokerCodeId)
    return match ? (match.code ? `${match.name} (${match.code})` : match.name) : values.brokerCodeName || draftBrokerCodeId
  }, [allBrokerCodes, draftBrokerCodeId, values.brokerCodeName])

  const handleAddOrUpdatePlan = () => {
    const newErrors: {
      planId?: string
      groupNumber?: string
      billerAccount?: string
    } = {}

    if (!draftPlanId.trim()) {
      newErrors.planId = EMPLOYER_CONTENT.validation.planRequired
    }
    if (!draftGroupNumber.trim()) {
      newErrors.groupNumber = EMPLOYER_CONTENT.validation.cgnGroupNumberRequired
    }
    if (!draftBillerAccount.trim()) {
      newErrors.billerAccount = EMPLOYER_CONTENT.validation.billerAccountNumberRequired
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const selectedPlan = allPlans.find((p) => p.id === draftPlanId)
    const selectedBroker = allBrokerCodes.find((b) => b.id === draftBrokerCodeId)

    form.setValue('planId', draftPlanId, { shouldValidate: true })
    form.setValue('planName', selectedPlan ? selectedPlan.name : values.planName || '')
    form.setValue('cgnGroupNumber', draftGroupNumber, { shouldValidate: true })
    form.setValue('billerAccountNumber', draftBillerAccount, { shouldValidate: true })
    form.setValue('cgnCustomerNumber', draftCustomerNumber, { shouldValidate: true })
    form.setValue('brokerCodeId', draftBrokerCodeId, { shouldValidate: true })
    form.setValue('brokerCodeName', selectedBroker ? selectedBroker.name : values.brokerCodeName || '')
    form.setValue('isActive', draftIsActive, { shouldValidate: true })
    form.clearErrors(['planId', 'cgnGroupNumber', 'billerAccountNumber'])

    // Clear inputs after adding/updating
    setDraftPlanId('')
    setDraftGroupNumber('')
    setDraftBillerAccount('')
    setDraftCustomerNumber('')
    setDraftBrokerCodeId('')
    setDraftIsActive(true)
    setIsEditing(false)
  }

  const handleRowClickToEdit = () => {
    setDraftPlanId(values.planId || '')
    setDraftGroupNumber(values.cgnGroupNumber || '')
    setDraftBillerAccount(values.billerAccountNumber || '')
    setDraftCustomerNumber(values.cgnCustomerNumber || '')
    setDraftBrokerCodeId(values.brokerCodeId || '')
    setDraftIsActive(values.isActive ?? true)
    setIsEditing(true)
    setErrors({})
  }

  const handleDeletePlan = (e: React.MouseEvent) => {
    e.stopPropagation()
    form.setValue('planId', '', { shouldValidate: false })
    form.setValue('planName', '')
    form.setValue('cgnGroupNumber', '', { shouldValidate: false })
    form.setValue('billerAccountNumber', '', { shouldValidate: false })
    form.setValue('cgnCustomerNumber', '')
    form.setValue('brokerCodeId', '')
    form.setValue('brokerCodeName', '')
    form.setValue('isActive', true)
    form.clearErrors(['planId', 'cgnGroupNumber', 'billerAccountNumber'])

    setDraftPlanId('')
    setDraftGroupNumber('')
    setDraftBillerAccount('')
    setDraftCustomerNumber('')
    setDraftBrokerCodeId('')
    setDraftIsActive(true)
    setIsEditing(false)
    setErrors({})
  }

  const handleCancelEdit = () => {
    setDraftPlanId('')
    setDraftGroupNumber('')
    setDraftBillerAccount('')
    setDraftCustomerNumber('')
    setDraftBrokerCodeId('')
    setDraftIsActive(true)
    setIsEditing(false)
    setErrors({})
  }

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
              value={draftPlanId}
              onValueChange={(val) => {
                setDraftPlanId(val)
                if (errors.planId) setErrors((prev) => ({ ...prev, planId: undefined }))
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
              <p className="text-xs font-medium text-destructive">{errors.planId}</p>
            ) : null}
          </div>
        </div>

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
                  setErrors((prev) => ({ ...prev, groupNumber: undefined }))
                }
              }}
            />
            {errors.groupNumber ? (
              <p className="text-xs font-medium text-destructive">{errors.groupNumber}</p>
            ) : null}
          </div>
        </div>

        {/* Biller Account Number */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
          <label htmlFor="plan-biller-account" className={REQUIRED_LABEL_CLASS}>
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
                  setErrors((prev) => ({ ...prev, billerAccount: undefined }))
                }
              }}
            />
            {errors.billerAccount ? (
              <p className="text-xs font-medium text-destructive">{errors.billerAccount}</p>
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
              onCheckedChange={(checked) => setDraftIsActive(Boolean(checked))}
            />
            <label
              htmlFor="plan-is-active"
              className="cursor-pointer text-sm font-medium text-slate-700"
            >
              {copy.activeStatus}
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isEditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
            >
              {copy.cancelEditButton}
            </Button>
          ) : null}

          <Button
            type="button"
            onClick={handleAddOrUpdatePlan}
            disabled={hasConfiguredPlan && !isEditing}
            className="bg-[#94723C] hover:bg-[#805e2b] text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="size-4" />
            {isEditing ? copy.updateButton : copy.addButton}
          </Button>
        </div>
      </div>

      {/* Added Plan Summary Table */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        {!hasConfiguredPlan &&
        (form.formState.errors.planId ||
          form.formState.errors.cgnGroupNumber ||
          form.formState.errors.billerAccountNumber) ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/75 px-4 py-2.5 text-xs font-medium text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{EMPLOYER_CONTENT.validation.planRequiresAtLeastOne}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {copy.addedPlanHeading}
          </h2>
          {hasConfiguredPlan ? (
            <span className="text-xs text-slate-500">
              {copy.clickRowToEditHint}
            </span>
          ) : null}
        </div>

        {hasConfiguredPlan ? (
          <EmployerPlanTable
            planName={selectedPlanLabel}
            groupNumber={values.cgnGroupNumber}
            billerAccountNumber={values.billerAccountNumber}
            customerNumber={values.cgnCustomerNumber}
            brokerCodeName={selectedBrokerCodeLabel}
            isActive={values.isActive}
            isSelected={isEditing}
            onRowClick={handleRowClickToEdit}
            onDelete={handleDeletePlan}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
            {copy.emptyTable}
          </div>
        )}
      </div>
    </div>
  )
}
