import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { useParentCompany } from '#/hooks/parent-company/useParentCompany.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import {
  buildEmployerGeneralReviewSections,
  buildEmployerPlanReviewSections,
} from '#/utils/buildEmployerReviewSections.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'
import type { AvailableCarrierOption } from '#/types/parent-company.ts'
import type { EmployerFormMode } from '#/utils/getEmployerStepValidationFields.ts'

const copy = EMPLOYER_CONTENT.reviewStep

export interface EmployerReviewStepProps {
  mode?: EmployerFormMode
}

export function ReviewStep({ mode = 'create' }: EmployerReviewStepProps = {}) {
  const form = useFormContext<EmployerFormValues>()
  const values = form.getValues()
  const { data: parentCompany } = useParentCompany(
    values.parentCompanyId || undefined,
  )
  const { data: states = [] } = useGetStates()

  const parentCompanyCarriers = useMemo<AvailableCarrierOption[]>(() => {
    const rawCarriers = parentCompany?.carriers ?? []
    const map = new Map<string, AvailableCarrierOption>()

    for (const item of rawCarriers) {
      const id = item.carrierId ?? (item as unknown as { id: string }).id
      const name = item.name
      if (id && name && !map.has(String(id))) {
        map.set(String(id), { id: String(id), name })
      }
    }

    return Array.from(map.values())
  }, [parentCompany?.carriers])

  const stateName = useMemo(() => {
    if (!values.state) return undefined
    return states.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values.state])

  const parentCompanyName = useMemo(() => {
    return parentCompany?.name || values.parentCompanyName || values.parentCompanyId
  }, [parentCompany?.name, values.parentCompanyId, values.parentCompanyName])

  const selectedCarrierNames = useMemo(
    () =>
      resolveSelectedCarrierOptions(
        values.carrierIds ?? [],
        parentCompanyCarriers,
        values.linkedCarriers ?? [],
      ),
    [parentCompanyCarriers, values.carrierIds, values.linkedCarriers],
  )

  const generalSections: ReviewSectionConfig[] = useMemo(
    () =>
      buildEmployerGeneralReviewSections(values, {
        parentCompanyName,
        stateName,
        selectedCarrierNames,
      }),
    [values, parentCompanyName, stateName, selectedCarrierNames],
  )

  const planSections: ReviewSectionConfig[] = useMemo(() => {
    if (mode === 'edit-plan' || (!values.plans || values.plans.length === 0)) {
      if (values.planId || values.cgnGroupNumber) {
        return buildEmployerPlanReviewSections([
          {
            planId: values.planId,
            planName: values.planName,
            cgnGroupNumber: values.cgnGroupNumber,
            billerAccountNumber: values.billerAccountNumber,
            cgnCustomerNumber: values.cgnCustomerNumber,
            brokerCodeId: values.brokerCodeId,
            brokerCodeName: values.brokerCodeName,
            isActive: values.isActive,
            rates: values.planRates ?? [],
          },
        ])
      }
      return buildEmployerPlanReviewSections([])
    }

    return buildEmployerPlanReviewSections(values.plans)
  }, [mode, values])

  const showGeneral = mode === 'create' || mode === 'edit-general'
  const showPlan = mode === 'create' || mode === 'edit-plan' || mode === 'add-plan'

  return (
    <div className="space-y-6">
      {showGeneral ? (
        <CommonReviewStep
          copy={{ emptyValue: copy.emptyValue }}
          sections={generalSections}
          layout="cards"
        />
      ) : null}

      {showPlan ? (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-tan-dark">
            {copy.sections.plansAndRates}
          </h4>
          <CommonReviewStep
            copy={{ emptyValue: copy.emptyValue }}
            sections={planSections}
            layout="accordion"
            defaultOpenSection={planSections[0]?.id}
          />
        </div>
      ) : null}
    </div>
  )
}

