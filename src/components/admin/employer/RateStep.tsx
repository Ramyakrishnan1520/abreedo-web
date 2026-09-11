import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AlertCircle, Plus } from 'lucide-react'

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

const copy = EMPLOYER_CONTENT.rateStep

export function RateStep() {
  const form = useFormContext<EmployerFormValues>()
  const planRates = form.watch('planRates') ?? []

  // Local state for the rate inputs
  const [effectiveDate, setEffectiveDate] = useState<string>('')
  const [individual, setIndividual] = useState<string>('')
  const [parentChild, setParentChild] = useState<string>('')
  const [parentChildren, setParentChildren] = useState<string>('')
  const [husbandWife, setHusbandWife] = useState<string>('')
  const [family, setFamily] = useState<string>('')

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<{
    effectiveDate?: string
    individual?: string
    parentChild?: string
    parentChildren?: string
    husbandWife?: string
    family?: string
  }>({})

  const isEditing = editingIndex !== null
  const hasEffectiveDate = Boolean(effectiveDate.trim())

  const handleAddOrUpdateRate = () => {
    const newErrors: {
      effectiveDate?: string
      individual?: string
      parentChild?: string
      parentChildren?: string
      husbandWife?: string
      family?: string
    } = {}

    if (!effectiveDate.trim()) {
      newErrors.effectiveDate = EMPLOYER_CONTENT.validation.effectiveDateRequired
    }

    const numInd = individual.trim() === '' ? NaN : Number(individual)
    const numPC = parentChild.trim() === '' ? NaN : Number(parentChild)
    const numPCC = parentChildren.trim() === '' ? NaN : Number(parentChildren)
    const numHW = husbandWife.trim() === '' ? NaN : Number(husbandWife)
    const numFam = family.trim() === '' ? NaN : Number(family)

    if (isNaN(numInd) || numInd < 0) {
      newErrors.individual = EMPLOYER_CONTENT.validation.individualRequired
    }
    if (isNaN(numPC) || numPC < 0) {
      newErrors.parentChild = EMPLOYER_CONTENT.validation.parentChildRequired
    }
    if (isNaN(numPCC) || numPCC < 0) {
      newErrors.parentChildren = EMPLOYER_CONTENT.validation.parentChildrenRequired
    }
    if (isNaN(numHW) || numHW < 0) {
      newErrors.husbandWife = EMPLOYER_CONTENT.validation.memberSpouseRequired
    }
    if (isNaN(numFam) || numFam < 0) {
      newErrors.family = EMPLOYER_CONTENT.validation.familyRequired
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const newRateItem: PlanRateFormItem = {
      id: isEditing ? planRates[editingIndex]?.id : undefined,
      planRateId: isEditing ? planRates[editingIndex]?.planRateId : undefined,
      effectiveDate,
      individual: numInd,
      parentChild: numPC,
      parentChildren: numPCC,
      husbandWife: numHW,
      family: numFam,
    }

    let updatedRates: PlanRateFormItem[]
    if (isEditing && editingIndex !== null) {
      updatedRates = [...planRates]
      updatedRates[editingIndex] = newRateItem
    } else {
      updatedRates = [...planRates, newRateItem]
    }

    form.setValue('planRates', updatedRates, { shouldValidate: true })
    form.clearErrors('planRates')

    // Reset inputs
    setEffectiveDate('')
    setIndividual('')
    setParentChild('')
    setParentChildren('')
    setHusbandWife('')
    setFamily('')
    setEditingIndex(null)
  }

  const handleRowClickToEdit = (rate: PlanRateFormItem, index: number) => {
    setEffectiveDate(rate.effectiveDate ? rate.effectiveDate.split('T')[0] : '')
    setIndividual(rate.individual !== undefined && rate.individual !== null ? String(rate.individual) : '')
    setParentChild(rate.parentChild !== undefined && rate.parentChild !== null ? String(rate.parentChild) : '')
    setParentChildren(rate.parentChildren !== undefined && rate.parentChildren !== null ? String(rate.parentChildren) : '')
    setHusbandWife(rate.husbandWife !== undefined && rate.husbandWife !== null ? String(rate.husbandWife) : '')
    setFamily(rate.family !== undefined && rate.family !== null ? String(rate.family) : '')
    setEditingIndex(index)
    setErrors({})
  }

  const handleCancelEdit = () => {
    setEffectiveDate('')
    setIndividual('')
    setParentChild('')
    setParentChildren('')
    setHusbandWife('')
    setFamily('')
    setEditingIndex(null)
    setErrors({})
  }

  return (
    <div className="space-y-8">
      {/* Rate Inputs */}
      <div className="space-y-6">
        {/* Effective Date */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
          <label htmlFor="rate-effective-date" className={REQUIRED_LABEL_CLASS}>
            {copy.effectiveDateLabel}
          </label>
          <div className="space-y-1">
            <DatePicker
              id="rate-effective-date"
              value={effectiveDate}
              onChange={(val) => {
                setEffectiveDate(val)
                if (errors.effectiveDate) {
                  setErrors((prev) => ({ ...prev, effectiveDate: undefined }))
                }
              }}
              placeholder={copy.effectiveDatePlaceholder}
              className="w-full sm:w-full"
            />
            {errors.effectiveDate ? (
              <p className="text-xs font-medium text-destructive">{errors.effectiveDate}</p>
            ) : null}
          </div>
        </div>

        {/* Numeric fields reveal once Effective Date is selected */}
        {hasEffectiveDate ? (
          <>
            {/* Individual */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="rate-individual" className={REQUIRED_LABEL_CLASS}>
                {copy.individualLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="rate-individual"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={copy.individualPlaceholder}
                  className={`${FORM_INPUT_CLASS} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={individual}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => {
                    setIndividual(e.target.value)
                    if (errors.individual) {
                      setErrors((prev) => ({ ...prev, individual: undefined }))
                    }
                  }}
                />
                {errors.individual ? (
                  <p className="text-xs font-medium text-destructive">{errors.individual}</p>
                ) : null}
              </div>
            </div>

            {/* Parent / Child */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="rate-parent-child" className={REQUIRED_LABEL_CLASS}>
                {copy.parentChildLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="rate-parent-child"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={copy.parentChildPlaceholder}
                  className={`${FORM_INPUT_CLASS} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={parentChild}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => {
                    setParentChild(e.target.value)
                    if (errors.parentChild) {
                      setErrors((prev) => ({ ...prev, parentChild: undefined }))
                    }
                  }}
                />
                {errors.parentChild ? (
                  <p className="text-xs font-medium text-destructive">{errors.parentChild}</p>
                ) : null}
              </div>
            </div>

            {/* Parent / Children */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="rate-parent-children" className={REQUIRED_LABEL_CLASS}>
                {copy.parentChildrenLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="rate-parent-children"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={copy.parentChildrenPlaceholder}
                  className={`${FORM_INPUT_CLASS} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={parentChildren}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => {
                    setParentChildren(e.target.value)
                    if (errors.parentChildren) {
                      setErrors((prev) => ({ ...prev, parentChildren: undefined }))
                    }
                  }}
                />
                {errors.parentChildren ? (
                  <p className="text-xs font-medium text-destructive">{errors.parentChildren}</p>
                ) : null}
              </div>
            </div>

            {/* Member Spouse */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="rate-member-spouse" className={REQUIRED_LABEL_CLASS}>
                {copy.memberSpouseLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="rate-member-spouse"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={copy.memberSpousePlaceholder}
                  className={`${FORM_INPUT_CLASS} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={husbandWife}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => {
                    setHusbandWife(e.target.value)
                    if (errors.husbandWife) {
                      setErrors((prev) => ({ ...prev, husbandWife: undefined }))
                    }
                  }}
                />
                {errors.husbandWife ? (
                  <p className="text-xs font-medium text-destructive">{errors.husbandWife}</p>
                ) : null}
              </div>
            </div>

            {/* Family */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <label htmlFor="rate-family" className={REQUIRED_LABEL_CLASS}>
                {copy.familyLabel}
              </label>
              <div className="space-y-1">
                <Input
                  id="rate-family"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={copy.familyPlaceholder}
                  className={`${FORM_INPUT_CLASS} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  value={family}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => {
                    setFamily(e.target.value)
                    if (errors.family) {
                      setErrors((prev) => ({ ...prev, family: undefined }))
                    }
                  }}
                />
                {errors.family ? (
                  <p className="text-xs font-medium text-destructive">{errors.family}</p>
                ) : null}
              </div>
            </div>

            {/* Action Buttons */}
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
                onClick={handleAddOrUpdateRate}
                className="bg-[#94723C] hover:bg-[#805e2b] text-white cursor-pointer"
              >
                <Plus className="size-4" />
                {isEditing ? copy.updateButton : copy.addButton}
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {/* Added Rates Table (Matching provided design) */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        {form.formState.errors.planRates?.message ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/75 px-4 py-2.5 text-xs font-medium text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{form.formState.errors.planRates.message}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {copy.addedRatesHeading}
          </h2>
          {planRates.length > 0 ? (
            <span className="text-xs text-slate-500">
              {copy.clickRowToEditHint}
            </span>
          ) : null}
        </div>

        <EmployerRatesTable
          rates={planRates}
          selectedIndex={editingIndex}
          onRowClick={handleRowClickToEdit}
        />
      </div>
    </div>
  )
}
