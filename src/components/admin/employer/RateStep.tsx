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

export function RateStep({ mode = 'create' }: EmployerRateStepProps = {}) {
  const form = useFormContext<EmployerFormValues>()
  const isSinglePlanEdit = mode === 'edit-plan'

  const plans = form.watch('plans') ?? []
  const singlePlanRates = form.watch('planRates') ?? []

  // Selected plan index for multi-plan mode
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0)

  // Rate inputs draft
  const [effectiveDate, setEffectiveDate] = useState<string>('')
  const [rateDraft, setRateDraft] = useState<RateTierDraft>(INITIAL_RATE_TIER_DRAFT)

  const [editingRateIndex, setEditingRateIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<
    { effectiveDate?: string } & Partial<Record<RateTierKey, string>>
  >({})

  const isEditing = editingRateIndex !== null
  const hasEffectiveDate = Boolean(effectiveDate.trim())

  // Safe clamped index to prevent out-of-bounds on plan deletions
  const safePlanIndex = Math.min(selectedPlanIndex, Math.max(0, plans.length - 1))

  // Current active rates
  const currentPlan = !isSinglePlanEdit && plans.length > 0 ? plans[safePlanIndex] : null
  const currentRates: PlanRateFormItem[] = isSinglePlanEdit
    ? singlePlanRates
    : currentPlan?.rates ?? []

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

  const handlePlanChange = (val: string) => {
    const idx = Number(val)
    if (!isNaN(idx) && idx >= 0 && idx < plans.length) {
      setSelectedPlanIndex(idx)
      setEffectiveDate('')
      setRateDraft(INITIAL_RATE_TIER_DRAFT)
      setEditingRateIndex(null)
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

    const newRateItem: PlanRateFormItem = {
      id: isEditing ? currentRates[editingRateIndex]?.id : undefined,
      planRateId: isEditing ? currentRates[editingRateIndex]?.planRateId : undefined,
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
      if (isEditing) {
        updatedRates = singlePlanRates.map((r, i) =>
          i === editingRateIndex ? newRateItem : r,
        )
        setEditingRateIndex(null)
      } else {
        updatedRates = [...singlePlanRates, newRateItem]
      }
      form.setValue('planRates', updatedRates, { shouldValidate: true })
      form.clearErrors(['planRates'])
    } else {
      // Multi-plan mode: update selected plan's rates
      const planToUpdate = plans[safePlanIndex]
      if (!planToUpdate) return

      let updatedPlanRates: PlanRateFormItem[]
      if (isEditing) {
        updatedPlanRates = (planToUpdate.rates ?? []).map((r, i) =>
          i === editingRateIndex ? newRateItem : r,
        )
        setEditingRateIndex(null)
      } else {
        updatedPlanRates = [...(planToUpdate.rates ?? []), newRateItem]
      }

      const updatedPlans = plans.map((p, idx) =>
        idx === safePlanIndex ? { ...p, rates: updatedPlanRates } : p,
      )

      form.setValue('plans', updatedPlans, { shouldValidate: true })
      form.clearErrors(['plans'])
    }

    // Reset rate inputs
    setEffectiveDate('')
    setRateDraft(INITIAL_RATE_TIER_DRAFT)
  }

  const handleEditRateRow = (rate: PlanRateFormItem, index: number) => {
    setEditingRateIndex(index)
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

  const handleDeleteRateRow = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSinglePlanEdit) {
      const updated = singlePlanRates.filter((_, i) => i !== index)
      form.setValue('planRates', updated, { shouldValidate: true })
    } else {
      const planToUpdate = plans[safePlanIndex]
      if (!planToUpdate) return
      const updatedRates = (planToUpdate.rates ?? []).filter((_, i) => i !== index)
      const updatedPlans = plans.map((p, idx) =>
        idx === safePlanIndex ? { ...p, rates: updatedRates } : p,
      )
      form.setValue('plans', updatedPlans, { shouldValidate: true })
    }

    if (editingRateIndex === index) {
      setEditingRateIndex(null)
      setEffectiveDate('')
      setRateDraft(INITIAL_RATE_TIER_DRAFT)
      setErrors({})
    }
  }

  const handleCancelEdit = () => {
    setEffectiveDate('')
    setRateDraft(INITIAL_RATE_TIER_DRAFT)
    setEditingRateIndex(null)
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
        {/* Multi-Plan Selector */}
        {!isSinglePlanEdit && plans.length > 0 ? (
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
            {!isSinglePlanEdit && currentPlan
              ? `${copy.addedRatesHeading} (${currentPlan.planName || 'Selected Plan'})`
              : copy.addedRatesHeading}
          </h2>
          {currentRates.length > 0 ? (
            <span className="text-xs text-slate-500">
              {copy.clickRowToEditHint}
            </span>
          ) : null}
        </div>

        <EmployerRatesTable
          rates={currentRates}
          selectedIndex={editingRateIndex}
          onRowClick={handleEditRateRow}
          onDelete={handleDeleteRateRow}
        />
      </div>
    </div>
  )
}
