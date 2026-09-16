import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AlertCircle, Plus } from 'lucide-react'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { EmployerForm } from '#/components/admin/employer/EmployerForm.tsx'
import { EmployerPlanTable } from '#/components/admin/employer/EmployerPlanTable.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import { useInfiniteBrokerCodes } from '#/hooks/broker-code/use-infinite-broker-codes.ts'
import { useInfinitePlans } from '#/hooks/plan/use-infinite-plans.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type {
  ConfiguredEmployerPlan,
  EmployerFormValues,
} from '#/components/admin/employer/employer.schema.ts'
import type { EmployerFormMode } from '#/utils/getEmployerStepValidationFields.ts'

const copy = EMPLOYER_CONTENT.planStep
const { form: formCopy, validation: v } = EMPLOYER_CONTENT

export interface EmployerPlanStepProps {
  mode?: EmployerFormMode
}


function PlanOverviewStep() {
  const form = useFormContext<EmployerFormValues>()
  const values = form.watch()
  const plans = form.watch('plans') ?? []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleOpenAdd = () => {
    setEditingIndex(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (_plan: ConfiguredEmployerPlan, index: number) => {
    setEditingIndex(index)
    setIsModalOpen(true)
  }

  const handleDeletePlan = (index: number) => {
    const updated = plans.filter((_, idx) => idx !== index)
    form.setValue('plans', updated, { shouldValidate: false })
    form.clearErrors('plans')
    if (editingIndex === index) {
      setEditingIndex(null)
    }
  }

  const handleSavePlansFromModal = (savedPlans: ConfiguredEmployerPlan[]) => {
    let updatedPlans: ConfiguredEmployerPlan[]

    if (editingIndex !== null && savedPlans.length === 1 && savedPlans[0]) {
      updatedPlans = plans.map((p, idx) =>
        idx === editingIndex ? savedPlans[0]! : p,
      )
    } else {
      const existingPlanIdSet = new Set(
        editingIndex !== null
          ? plans.filter((_, idx) => idx !== editingIndex).map((p) => p.planId)
          : plans.map((p) => p.planId),
      )
      const newUniquePlans = savedPlans.filter(
        (p) => !existingPlanIdSet.has(p.planId),
      )
      updatedPlans =
        editingIndex !== null
          ? plans.map((p, idx) => (idx === editingIndex ? (savedPlans[0] ?? p) : p))
          : [...plans, ...newUniquePlans]
    }

    form.setValue('plans', updatedPlans, { shouldValidate: true })
    form.clearErrors(['plans'])
    setIsModalOpen(false)
    setEditingIndex(null)
  }

  const modalInitialValues = useMemo(() => {
    const addedPlanIds = plans
      .map((p, idx) => (idx === editingIndex ? null : p.planId))
      .filter((id): id is string => Boolean(id))
    const existingIds = Array.from(
      new Set([...(values.existingPlanIds ?? []), ...addedPlanIds]),
    )

    if (editingIndex !== null && plans[editingIndex]) {
      const planToEdit = plans[editingIndex]!
      return {
        parentCompanyId: values.parentCompanyId,
        parentCompanyName: values.parentCompanyName,
        carrierIds: values.carrierIds,
        plans: [planToEdit],
        existingPlanIds: existingIds,
      }
    }

    return {
      parentCompanyId: values.parentCompanyId,
      parentCompanyName: values.parentCompanyName,
      carrierIds: values.carrierIds,
      plans: [],
      existingPlanIds: existingIds,
    }
  }, [
    values.parentCompanyId,
    values.parentCompanyName,
    values.carrierIds,
    values.existingPlanIds,
    plans,
    editingIndex,
  ])

  const hasConfiguredPlans = plans.length > 0

  return (
    <div className="space-y-6">
      {/* Top Header with Description & "Select Plan" Action Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
            {copy.addedPlanHeading}
          </h2>
          <p className="text-xs text-slate-500">{copy.clickRowToEditHint}</p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="h-9 gap-1.5 self-start sm:self-auto bg-tan-dark text-white hover:bg-tan-dark/90 cursor-pointer shadow-xs"
        >
          <Plus className="size-4" />
          {copy.selectPlanButton}
        </Button>
      </div>

      {/* Error Banner when attempting to proceed without at least one plan */}
      {!hasConfiguredPlans && form.formState.errors.plans ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/75 px-4 py-2.5 text-xs font-medium text-red-700">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{EMPLOYER_CONTENT.validation.planRequiresAtLeastOne}</span>
        </div>
      ) : null}

      {/* Plans Table with expandable nested rate rows, Edit & Delete */}
      <EmployerPlanTable
        plans={plans}
        expandable={true}
        selectedIndex={editingIndex}
        onEdit={handleOpenEdit}
        onDelete={handleDeletePlan}
      />

      {/* 3-Step Plan & Rate Selection Modal Dialog using the exact EmployerForm */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden p-0 rounded-2xl border border-slate-200 bg-white flex flex-col"
          closeClassName="top-5 right-5 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <DialogTitle className="sr-only">
            {editingIndex !== null
              ? formCopy.titles.editPlan
              : formCopy.titles.addPlan}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {editingIndex !== null
              ? copy.modalDescriptionEdit
              : copy.modalDescriptionAdd}
          </DialogDescription>

          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <EmployerForm
              key={`modal-plan-form-${editingIndex !== null ? 'edit-' + editingIndex : 'new'}`}
              mode="add-plan"
              initialValues={modalInitialValues}
              className="h-full min-h-0 border-0 rounded-none shadow-none flex flex-col"
              onBack={() => setIsModalOpen(false)}
              onSavePlans={handleSavePlansFromModal}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


function PlanFormInputStep({ mode = 'add-plan' }: EmployerPlanStepProps) {
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

  const allBrokerCodes = useMemo(
    () => brokerCodesData?.pages.flatMap((page) => page.items) ?? [],
    [brokerCodesData],
  )

  const initialPlan = isSinglePlanEdit
    ? plans[0] || (values.planId
        ? {
            id: `plan-${values.planId}`,
            planId: values.planId,
            planName: values.planName || '',
            cgnGroupNumber: values.cgnGroupNumber || '',
            billerAccountNumber: values.billerAccountNumber || '',
            cgnCustomerNumber: values.cgnCustomerNumber || '',
            brokerCodeId: values.brokerCodeId || '',
            brokerCodeName: values.brokerCodeName || '',
            isActive: values.isActive ?? true,
            rates: values.planRates ?? [],
          }
        : null)
    : null

  const [editingIndex, setEditingIndex] = useState<number | null>(() =>
    isSinglePlanEdit && initialPlan?.planId ? 0 : null,
  )

  const [draftPlanId, setDraftPlanId] = useState<string>(() => initialPlan?.planId || '')
  const [draftPlanName, setDraftPlanName] = useState<string>(() => initialPlan?.planName || '')
  const [draftGroupNumber, setDraftGroupNumber] = useState<string>(() => initialPlan?.cgnGroupNumber || '')
  const [draftBillerAccount, setDraftBillerAccount] = useState<string>(() => initialPlan?.billerAccountNumber || '')
  const [draftCustomerNumber, setDraftCustomerNumber] = useState<string>(() => initialPlan?.cgnCustomerNumber || '')
  const [draftBrokerCodeId, setDraftBrokerCodeId] = useState<string>(() => initialPlan?.brokerCodeId || '')
  const [draftBrokerCodeName, setDraftBrokerCodeName] = useState<string>(() => initialPlan?.brokerCodeName || '')
  const [draftIsActive, setDraftIsActive] = useState<boolean>(() => initialPlan?.isActive ?? true)

  const [hasInitializedEdit, setHasInitializedEdit] = useState(false)

  // Prepopulate initial values into form's plans array and draft state when in edit-plan mode
  useEffect(() => {
    if (isSinglePlanEdit && !hasInitializedEdit && (values.planId || plans.length > 0)) {
      const p = plans[0] || {
        id: values.planId ? `plan-${values.planId}` : 'single-plan',
        planId: values.planId || '',
        planName: values.planName || '',
        cgnGroupNumber: values.cgnGroupNumber || '',
        billerAccountNumber: values.billerAccountNumber || '',
        cgnCustomerNumber: values.cgnCustomerNumber || '',
        brokerCodeId: values.brokerCodeId || '',
        brokerCodeName: values.brokerCodeName || '',
        isActive: values.isActive ?? true,
        rates: values.planRates ?? [],
      }

      if (plans.length === 0 && (values.planId || values.cgnGroupNumber)) {
        form.setValue('plans', [p], { shouldValidate: true })
      }

      setDraftPlanId(p.planId || '')
      setDraftPlanName(p.planName || '')
      setDraftGroupNumber(p.cgnGroupNumber || '')
      setDraftBillerAccount(p.billerAccountNumber || '')
      setDraftCustomerNumber(p.cgnCustomerNumber || '')
      setDraftBrokerCodeId(p.brokerCodeId || '')
      setDraftBrokerCodeName(p.brokerCodeName || '')
      setDraftIsActive(p.isActive ?? true)
      setEditingIndex(0)
      setHasInitializedEdit(true)
    }
  }, [
    isSinglePlanEdit,
    hasInitializedEdit,
    values.planId,
    values.planName,
    values.cgnGroupNumber,
    values.billerAccountNumber,
    values.cgnCustomerNumber,
    values.brokerCodeId,
    values.brokerCodeName,
    values.isActive,
    values.planRates,
    plans,
    form,
  ])

  const [errors, setErrors] = useState<{
    planId?: string
    groupNumber?: string
    billerAccount?: string
  }>({})

  const isEditing = editingIndex !== null
  const hasPlanSelected = Boolean(draftPlanId.trim())

  // Exclude already added plans from dropdown options, but never exclude the plan being edited
  const availablePlans = useMemo(() => {
    const currentEditingId =
      editingIndex !== null && plans[editingIndex]
        ? plans[editingIndex]?.planId
        : draftPlanId || null

    const addedInFormIds = plans
      .map((p, idx) => (idx === editingIndex ? null : p.planId))
      .filter((id): id is string => Boolean(id))

    const excludedIds = new Set(
      [...(values.existingPlanIds ?? []), ...addedInFormIds].filter(
        (id) => Boolean(id) && id !== currentEditingId,
      ),
    )
    return allPlans.filter((p) => !excludedIds.has(p.id))
  }, [
    allPlans,
    values.existingPlanIds,
    plans,
    editingIndex,
    draftPlanId,
  ])

  const planOptions = useMemo(
    () =>
      availablePlans.map((plan) => ({
        value: plan.id,
        label: plan.code ? `${plan.name} (${plan.code})` : plan.name,
      })),
    [availablePlans],
  )

  const brokerCodeOptions = useMemo(
    () =>
      allBrokerCodes.map((broker) => ({
        value: broker.id,
        label: broker.code ? `${broker.name} (${broker.code})` : broker.name,
      })),
    [allBrokerCodes],
  )

  const selectedDraftPlanLabel = useMemo(() => {
    if (!draftPlanId) return ''
    const match = allPlans.find((p) => p.id === draftPlanId)
    return match
      ? match.code
        ? `${match.name} (${match.code})`
        : match.name
      : draftPlanName || draftPlanId
  }, [allPlans, draftPlanId, draftPlanName])

  const selectedDraftBrokerLabel = useMemo(() => {
    if (!draftBrokerCodeId) return ''
    const match = allBrokerCodes.find((b) => b.id === draftBrokerCodeId)
    return match
      ? match.code
        ? `${match.name} (${match.code})`
        : match.name
      : draftBrokerCodeName || draftBrokerCodeId
  }, [allBrokerCodes, draftBrokerCodeId, draftBrokerCodeName])

  const handleAddOrUpdatePlan = () => {
    const newErrors: {
      planId?: string
      groupNumber?: string
      billerAccount?: string
    } = {}

    if (!draftPlanId.trim()) {
      newErrors.planId = v.planRequired
    }
    if (!draftGroupNumber.trim()) {
      newErrors.groupNumber = v.cgnGroupNumberRequired
    }
    if (!draftBillerAccount.trim()) {
      newErrors.billerAccount = v.billerAccountNumberRequired
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const selectedPlan = allPlans.find((p) => p.id === draftPlanId)
    const selectedBroker = allBrokerCodes.find((b) => b.id === draftBrokerCodeId)
    const resolvedPlanName = selectedPlan
      ? selectedPlan.name
      : selectedDraftPlanLabel || draftPlanId
    const resolvedBrokerName = selectedBroker
      ? selectedBroker.name
      : selectedDraftBrokerLabel || draftBrokerCodeId

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
      rates:
        editingIndex !== null
          ? plans[editingIndex]?.rates ?? (values.planRates ?? [])
          : [],
    }

    let updatedPlans: ConfiguredEmployerPlan[]
    if (editingIndex !== null) {
      updatedPlans = plans.map((p, idx) =>
        idx === editingIndex ? newPlanItem : p,
      )
    } else {
      updatedPlans = [...plans, newPlanItem]
    }

    form.setValue('plans', updatedPlans, { shouldValidate: true })
    form.clearErrors(['plans'])

    if (isSinglePlanEdit) {
      form.setValue('planId', draftPlanId, { shouldValidate: true })
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
    }

    // Reset fields and collapse after add/update
    setEditingIndex(null)
    setDraftPlanId('')
    setDraftPlanName('')
    setDraftGroupNumber('')
    setDraftBillerAccount('')
    setDraftCustomerNumber('')
    setDraftBrokerCodeId('')
    setDraftBrokerCodeName('')
    setDraftIsActive(true)
  }

  const handleEditPlanRow = (plan: ConfiguredEmployerPlan, index: number) => {
    setDraftPlanId(plan.planId || '')
    setDraftPlanName(plan.planName || '')
    setDraftGroupNumber(plan.cgnGroupNumber || '')
    setDraftBillerAccount(plan.billerAccountNumber || '')
    setDraftCustomerNumber(plan.cgnCustomerNumber || '')
    setDraftBrokerCodeId(plan.brokerCodeId || '')
    setDraftBrokerCodeName(plan.brokerCodeName || '')
    setDraftIsActive(plan.isActive ?? true)
    setEditingIndex(index)
    setErrors({})
  }

  const handleDeletePlanRow = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = plans.filter((_, idx) => idx !== index)
    form.setValue('plans', updated, { shouldValidate: false })
    form.clearErrors('plans')
    if (editingIndex === index) {
      setEditingIndex(null)
      setDraftPlanId('')
      setDraftPlanName('')
      setDraftGroupNumber('')
      setDraftBillerAccount('')
      setDraftCustomerNumber('')
      setDraftBrokerCodeId('')
      setDraftBrokerCodeName('')
      setDraftIsActive(true)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setDraftPlanId('')
    setDraftPlanName('')
    setDraftGroupNumber('')
    setDraftBillerAccount('')
    setDraftCustomerNumber('')
    setDraftBrokerCodeId('')
    setDraftBrokerCodeName('')
    setDraftIsActive(true)
    setErrors({})
  }

  return (
    <div className="space-y-8">
      {/* Plan Form Fields */}
      <div className="space-y-6">
        {/* Plan Select */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
          <label htmlFor="plan-select-input" className={REQUIRED_LABEL_CLASS}>
            {copy.planLabel}
          </label>
          <div className="space-y-1">
            <ConfigurableSelect
              id="plan-select-input"
              value={draftPlanId}
              onValueChange={(val) => {
                setDraftPlanId(val)
                const match = allPlans.find((p) => p.id === val)
                if (match) {
                  setDraftPlanName(match.name)
                }
                if (errors.planId) {
                  setErrors((prev) => ({ ...prev, planId: undefined }))
                }
              }}
              options={planOptions}
              selectedLabel={selectedDraftPlanLabel}
              placeholder={copy.planPlaceholder}
              loading={isLoadingPlans}
              loadingPlaceholder={copy.planLoadingPlaceholder}
              disabled={isSinglePlanEdit && !isEditing}
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

        {/* Additional Plan Fields reveal only after selecting a plan */}
        {hasPlanSelected ? (
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
                      setErrors((prev) => ({ ...prev, groupNumber: undefined }))
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
                htmlFor="plan-biller-account-number"
                className={REQUIRED_LABEL_CLASS}
              >
                {copy.billerAccountNumberLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="plan-biller-account-number"
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
                  onChange={(e) => {
                    setDraftCustomerNumber(e.target.value)
                  }}
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
                  onValueChange={(val) => {
                    setDraftBrokerCodeId(val)
                    const match = allBrokerCodes.find((b) => b.id === val)
                    if (match) {
                      setDraftBrokerCodeName(match.name)
                    }
                  }}
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

            {/* Active Toggle */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label className={LABEL_COL}>{copy.isActiveLabel}</label>
              <div className="flex items-center gap-2 pt-0.5 sm:pt-2">
                <Checkbox
                  id="plan-is-active"
                  checked={draftIsActive}
                  onCheckedChange={(checked) => {
                    setDraftIsActive(Boolean(checked))
                  }}
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
              {isEditing ? (
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
                {isEditing ? null : <Plus className="size-4" />}
                {isEditing ? copy.updateButton : copy.addButton}
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {/* Added Plans Summary Table in Modal */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        {plans.length === 0 && form.formState.errors.plans ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/75 px-4 py-2.5 text-xs font-medium text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>
              {form.formState.errors.plans.message ||
                EMPLOYER_CONTENT.validation.planRequiresAtLeastOne}
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {copy.addedPlanHeading}
          </h3>
          {plans.length > 0 ? (
            <span className="text-xs text-slate-500">
              {copy.clickRowToEditHint}
            </span>
          ) : null}
        </div>

        <EmployerPlanTable
          plans={plans}
          selectedIndex={editingIndex}
          onEdit={handleEditPlanRow}
          onDelete={isSinglePlanEdit ? undefined : handleDeletePlanRow}
        />
      </div>
    </div>
  )
}

export function PlanStep({ mode = 'create' }: EmployerPlanStepProps = {}) {
  if (mode === 'create') {
    return <PlanOverviewStep />
  }

  return <PlanFormInputStep mode={mode} />
}
