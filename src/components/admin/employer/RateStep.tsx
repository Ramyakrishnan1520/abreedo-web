import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AlertCircle, Plus } from 'lucide-react'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import { DatePicker } from '#/components/admin/common/DatePicker.tsx'
import { EmployerRatesTable } from '#/components/admin/employer/EmployerRatesTable.tsx'
import {
  FORM_INPUT_CLASS,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type {
  EmployerFormValues,
  PlanRateFormItem,
} from '#/components/admin/employer/employer.schema.ts'
import type { EmployerFormMode } from '#/utils/getEmployerStepValidationFields.ts'

const copy = EMPLOYER_CONTENT.rateStep
const { validation: v } = EMPLOYER_CONTENT

interface RateTierDraft {
  individual: string
  parentChild: string
  parentChildren: string
  husbandWife: string
  family: string
}

const INITIAL_RATE_TIER_DRAFT: RateTierDraft = {
  individual: '',
  parentChild: '',
  parentChildren: '',
  husbandWife: '',
  family: '',
}

type RateTierKey = keyof RateTierDraft

interface RateTierConfig {
  key: RateTierKey
  label: string
  placeholder: string
  errorMsg: string
}

const RATE_TIERS: RateTierConfig[] = [
  {
    key: 'individual',
    label: copy.individualLabel,
    placeholder: copy.individualPlaceholder,
    errorMsg: v.individualRequired,
  },
  {
    key: 'parentChild',
    label: copy.parentChildLabel,
    placeholder: copy.parentChildPlaceholder,
    errorMsg: v.parentChildRequired,
  },
  {
    key: 'parentChildren',
    label: copy.parentChildrenLabel,
    placeholder: copy.parentChildrenPlaceholder,
    errorMsg: v.parentChildrenRequired,
  },
  {
    key: 'husbandWife',
    label: copy.memberSpouseLabel,
    placeholder: copy.memberSpousePlaceholder,
    errorMsg: v.memberSpouseRequired,
  },
  {
    key: 'family',
    label: copy.familyLabel,
    placeholder: copy.familyPlaceholder,
    errorMsg: v.familyRequired,
  },
]

export interface EmployerRateStepProps {
  mode?: EmployerFormMode
}

export interface RateWithPlanInfo extends PlanRateFormItem {
  planIndex: number
  planId: string
  planName: string
  rateIndexInPlan: number
}

export function RateStep({ mode = 'create' }: EmployerRateStepProps = {}) {
  const form = useFormContext<EmployerFormValues>()
  const isSinglePlanEdit = mode === 'edit-plan'

  const plans = form.watch('plans') ?? []
  const singlePlanRates = form.watch('planRates') ?? []

  // Selected plan index for adding rates
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0)

  // Rate inputs draft
  const [effectiveDate, setEffectiveDate] = useState<string>('')
  const [rateDraft, setRateDraft] = useState<RateTierDraft>(INITIAL_RATE_TIER_DRAFT)

  // Track the rate being edited across all plans
  const [editingRateInfo, setEditingRateInfo] = useState<{
    planIndex: number
    rateIndexInPlan: number
    globalIndex: number
  } | null>(null)

  const [errors, setErrors] = useState<
    { effectiveDate?: string } & Partial<Record<RateTierKey, string>>
  >({})

  const isEditing = editingRateInfo !== null
  const hasEffectiveDate = Boolean(effectiveDate.trim())

  // Safe clamped index to prevent out-of-bounds on plan deletions
  const safePlanIndex = Math.min(selectedPlanIndex, Math.max(0, plans.length - 1))

  // Plan selector options for multi-plan mode
  const planSelectOptions = useMemo(
    () =>
      plans.map((p, idx) => ({
        value: String(idx),
        label: p.planName
          ? `${p.planName} (${p.cgnGroupNumber || 'Group ' + (idx + 1)})`
          : `Plan ${idx + 1} (${p.cgnGroupNumber || 'No Group'})`,
      })),
    [plans],
  )

  const selectedPlanSelectLabel = useMemo(() => {
    if (plans.length === 0 || safePlanIndex >= plans.length) return ''
    const p = plans[safePlanIndex]
    return p.planName
      ? `${p.planName} (${p.cgnGroupNumber || 'Group ' + (safePlanIndex + 1)})`
      : `Plan ${safePlanIndex + 1} (${p.cgnGroupNumber || 'No Group'})`
  }, [plans, safePlanIndex])

  // Flattened array of all rates across all plans with plan name metadata
  const allRatesWithPlan = useMemo<RateWithPlanInfo[]>(() => {
    if (isSinglePlanEdit) {
      const pName = plans[0]?.planName || form.watch('planName') || ''
      const pId = plans[0]?.planId || form.watch('planId') || ''
      return singlePlanRates.map((r, rateIdx) => ({
        ...r,
        planIndex: 0,
        planId: pId,
        planName: pName,
        rateIndexInPlan: rateIdx,
      }))
    }

    return plans.flatMap((plan, planIdx) => {
      const planName =
        plan.planName ||
        (plan.cgnGroupNumber ? `Plan (${plan.cgnGroupNumber})` : `Plan ${planIdx + 1}`)
      const rates = plan.rates ?? []
      return rates.map((rate, rateIdx) => ({
        ...rate,
        planIndex: planIdx,
        planId: plan.planId,
        planName,
        rateIndexInPlan: rateIdx,
      }))
    })
  }, [plans, singlePlanRates, isSinglePlanEdit, form])

  const handlePlanChange = (val: string) => {
    const idx = Number(val)
    if (!isNaN(idx) && idx >= 0 && idx < plans.length) {
      setSelectedPlanIndex(idx)
      setEffectiveDate('')
      setRateDraft(INITIAL_RATE_TIER_DRAFT)
      setEditingRateInfo(null)
      setErrors({})
    }
  }

  const handleAddOrUpdateRate = () => {
    const newErrors: { effectiveDate?: string } & Partial<Record<RateTierKey, string>> = {}

    if (!effectiveDate.trim()) {
      newErrors.effectiveDate = v.effectiveDateRequired
    }

    const parsedRates: Partial<Record<RateTierKey, number>> = {}
    for (const tier of RATE_TIERS) {
      const rawVal = rateDraft[tier.key]
      const cleanVal = rawVal.replace(/^\$/, '').trim()
      const num = cleanVal === '' ? NaN : Number(cleanVal)
      if (isNaN(num) || num < 0) {
        newErrors[tier.key] = tier.errorMsg
      } else {
        parsedRates[tier.key] = num
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const targetPlanIndex = editingRateInfo ? editingRateInfo.planIndex : safePlanIndex
    const currentPlanRates = plans[targetPlanIndex]?.rates ?? []

    const newRateItem: PlanRateFormItem = {
      id: editingRateInfo
        ? currentPlanRates[editingRateInfo.rateIndexInPlan]?.id
        : undefined,
      planRateId: editingRateInfo
        ? currentPlanRates[editingRateInfo.rateIndexInPlan]?.planRateId
        : undefined,
      effectiveDate,
      individual: parsedRates.individual ?? 0,
      parentChild: parsedRates.parentChild ?? 0,
      parentChildren: parsedRates.parentChildren ?? 0,
      husbandWife: parsedRates.husbandWife ?? 0,
      family: parsedRates.family ?? 0,
    }

    if (isSinglePlanEdit) {
      // Single plan mode
      let updatedRates: PlanRateFormItem[]
      if (editingRateInfo) {
        updatedRates = singlePlanRates.map((r, i) =>
          i === editingRateInfo.rateIndexInPlan ? newRateItem : r,
        )
        setEditingRateInfo(null)
      } else {
        updatedRates = [...singlePlanRates, newRateItem]
      }
      form.setValue('planRates', updatedRates, { shouldValidate: true })
      if (plans.length > 0) {
        const updatedPlans = plans.map((p, idx) =>
          idx === 0 ? { ...p, rates: updatedRates } : p,
        )
        form.setValue('plans', updatedPlans, { shouldValidate: true })
      }
      form.clearErrors(['planRates', 'plans'])
    } else {
      // Multi-plan mode: update target plan's rates
      const planToUpdate = plans[targetPlanIndex]
      if (!planToUpdate) return

      let updatedPlanRates: PlanRateFormItem[]
      if (editingRateInfo) {
        updatedPlanRates = (planToUpdate.rates ?? []).map((r, i) =>
          i === editingRateInfo.rateIndexInPlan ? newRateItem : r,
        )
        setEditingRateInfo(null)
      } else {
        updatedPlanRates = [...(planToUpdate.rates ?? []), newRateItem]
      }

      const updatedPlans = plans.map((p, idx) =>
        idx === targetPlanIndex ? { ...p, rates: updatedPlanRates } : p,
      )

      form.setValue('plans', updatedPlans, { shouldValidate: true })
      form.clearErrors(['plans'])
    }

    // Reset rate inputs
    setEffectiveDate('')
    setRateDraft(INITIAL_RATE_TIER_DRAFT)
  }

  const handleEditRateRow = (rate: RateWithPlanInfo, globalIndex: number) => {
    setEditingRateInfo({
      planIndex: rate.planIndex,
      rateIndexInPlan: rate.rateIndexInPlan,
      globalIndex,
    })
    setSelectedPlanIndex(rate.planIndex)
    setEffectiveDate(rate.effectiveDate ? rate.effectiveDate.split('T')[0] : '')
    setRateDraft({
      individual:
        rate.individual !== undefined && rate.individual !== null
          ? String(rate.individual)
          : '',
      parentChild:
        rate.parentChild !== undefined && rate.parentChild !== null
          ? String(rate.parentChild)
          : '',
      parentChildren:
        rate.parentChildren !== undefined && rate.parentChildren !== null
          ? String(rate.parentChildren)
          : '',
      husbandWife:
        rate.husbandWife !== undefined && rate.husbandWife !== null
          ? String(rate.husbandWife)
          : '',
      family:
        rate.family !== undefined && rate.family !== null
          ? String(rate.family)
          : '',
    })
    setErrors({})
  }

  const handleDeleteRateRow = (globalIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const target = allRatesWithPlan[globalIndex]
    if (!target) return

    if (isSinglePlanEdit) {
      const updated = singlePlanRates.filter((_, i) => i !== target.rateIndexInPlan)
      form.setValue('planRates', updated, { shouldValidate: false })
      form.clearErrors(['planRates', 'plans'])
      if (plans.length > 0) {
        const updatedPlans = plans.map((p, idx) =>
          idx === 0 ? { ...p, rates: updated } : p,
        )
        form.setValue('plans', updatedPlans, { shouldValidate: false })
      }
    } else {
      const planToUpdate = plans[target.planIndex]
      if (!planToUpdate) return
      const updatedRates = (planToUpdate.rates ?? []).filter(
        (_, i) => i !== target.rateIndexInPlan,
      )
      const updatedPlans = plans.map((p, idx) =>
        idx === target.planIndex ? { ...p, rates: updatedRates } : p,
      )
      form.setValue('plans', updatedPlans, { shouldValidate: false })
      form.clearErrors(['plans', 'planRates'])
    }

    if (editingRateInfo?.globalIndex === globalIndex) {
      setEditingRateInfo(null)
      setEffectiveDate('')
      setRateDraft(INITIAL_RATE_TIER_DRAFT)
      setErrors({})
    }
  }

  const handleCancelEdit = () => {
    setEffectiveDate('')
    setRateDraft(INITIAL_RATE_TIER_DRAFT)
    setEditingRateInfo(null)
    setErrors({})
  }

  // Check if any plan in multi-plan mode is missing rates
  const plansMissingRates = useMemo(() => {
    if (isSinglePlanEdit) return []
    return plans.filter((p) => !p.rates || p.rates.length === 0)
  }, [isSinglePlanEdit, plans])

  return (
    <div className="space-y-8">
      {/* Rate Form Fields */}
      <div className="space-y-6">
        {/* Multi-Plan Selector (only when multiple plans are present) */}
        {!isSinglePlanEdit && plans.length > 1 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <label htmlFor="rate-plan-select" className={REQUIRED_LABEL_CLASS}>
              {copy.selectPlanLabel}
            </label>
            <div className="space-y-1">
              <ConfigurableSelect
                id="rate-plan-select"
                value={String(safePlanIndex)}
                onValueChange={handlePlanChange}
                options={planSelectOptions}
                selectedLabel={selectedPlanSelectLabel}
                placeholder={copy.selectPlanPlaceholder}
                triggerClassName={FORM_INPUT_CLASS}
              />
            </div>
          </div>
        ) : null}

        {/* Effective Date */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
          <label htmlFor="rate-effective-date" className={REQUIRED_LABEL_CLASS}>
            {copy.effectiveDateLabel}
          </label>
          <div className="space-y-1">
            <DatePicker
              value={effectiveDate}
              onChange={(val) => {
                setEffectiveDate(val)
                if (errors.effectiveDate) {
                  setErrors((prev) => ({ ...prev, effectiveDate: undefined }))
                }
              }}
              placeholder={copy.effectiveDatePlaceholder}
            />
            {errors.effectiveDate ? (
              <p className="text-xs font-medium text-destructive">
                {errors.effectiveDate}
              </p>
            ) : null}
          </div>
        </div>

        {/* Rate Tier Fields reveal once an Effective Date is entered */}
        {hasEffectiveDate ? (
          <>
            {RATE_TIERS.map((tier) => (
              <div
                key={tier.key}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4"
              >
                <label
                  htmlFor={`rate-${tier.key}`}
                  className={REQUIRED_LABEL_CLASS}
                >
                  {tier.label}
                </label>
                <div className="space-y-1">
                  <Input
                    id={`rate-${tier.key}`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={tier.placeholder}
                    className={FORM_INPUT_CLASS}
                    value={rateDraft[tier.key]}
                    onChange={(e) => {
                      const val = e.target.value
                      setRateDraft((prev) => ({ ...prev, [tier.key]: val }))
                      if (errors[tier.key]) {
                        setErrors((prev) => ({
                          ...prev,
                          [tier.key]: undefined,
                        }))
                      }
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  {errors[tier.key] ? (
                    <p className="text-xs font-medium text-destructive">
                      {errors[tier.key]}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}

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
                onClick={handleAddOrUpdateRate}
                className="bg-tan-dark hover:bg-tan-dark/90 text-white cursor-pointer"
              >
                <Plus className="size-4" />
                {isEditing ? copy.updateButton : copy.addButton}
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {/* Added Rates Summary Table */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        {plansMissingRates.length > 0 &&
        (form.formState.errors.plans || form.formState.isSubmitted) ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/75 px-4 py-2.5 text-xs font-medium text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>
              {plansMissingRates.map((p) => p.planName || 'Plan').join(', ')} —{' '}
              {copy.allPlansMustHaveRates}
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {copy.addedRatesHeading}
          </h2>
          {allRatesWithPlan.length > 0 ? (
            <span className="text-xs text-slate-500">
              {copy.clickRowToEditHint}
            </span>
          ) : null}
        </div>

        <EmployerRatesTable
          rates={allRatesWithPlan}
          showPlanName={!isSinglePlanEdit}
          selectedIndex={editingRateInfo?.globalIndex ?? null}
          onRowClick={handleEditRateRow}
          onDelete={handleDeleteRateRow}
        />
      </div>
    </div>
  )
}

