import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { useInfiniteCoverageCodeOptions } from '#/hooks/coverage-code/use-infinite-coverage-code-options.ts'
import { useAvailableParentCompanies } from '#/hooks/parent-company/useAvailableParentCompanies.ts'
import { useCommissionCodeOptions } from '#/hooks/commisssion-code/useCommissionCodeOptions'
import { useInfinitePlanOptions } from '#/hooks/plan/use-infinite-plan-options.ts'
import { useGroupTypeOptions } from '#/hooks/plan/useGroupTypeOptions.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import { resolveOptionLabel } from '#/utils/resolveOptionLabel.ts'

import type { PlanFormSchemaValues } from '#/components/admin/plan/plan.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

export function ReviewStep() {
  const form = useFormContext<PlanFormSchemaValues>()
  const values = form.getValues()
  const copy = PLAN_CONTENT.reviewStep

  const { parentCompanies } = useAvailableParentCompanies()
  const { coverageCodes } = useInfiniteCoverageCodeOptions(values.parentCompanyId)
  const { options: commissionCodeOptions } = useCommissionCodeOptions()
  const { options: groupTypeOptions } = useGroupTypeOptions()
  const { plans } = useInfinitePlanOptions(values.parentCompanyId)

  const parentCompanyName = useMemo(() => {
    return resolveOptionLabel(
      values.parentCompanyId,
      parentCompanies,
      values.parentCompanyName,
    )
  }, [parentCompanies, values.parentCompanyId, values.parentCompanyName])

  const coverageCodeName = useMemo(() => {
    return resolveOptionLabel(
      values.coverageCodeId,
      coverageCodes.map((c) => ({ id: c.id, name: c.description || c.code })),
      values.coverageCodeTitle,
    )
  }, [coverageCodes, values.coverageCodeId, values.coverageCodeTitle])

  const commissionCodeName = useMemo(() => {
    if (!values.commissionCodeId) return undefined
    return (
      commissionCodeOptions.find(
        (opt) => String(opt.value) === String(values.commissionCodeId),
      )?.label ?? values.commissionCodeId
    )
  }, [commissionCodeOptions, values.commissionCodeId])

  const groupTypeName = useMemo(() => {
    if (!values.groupType) return undefined
    return (
      groupTypeOptions.find((gt) => gt.value === values.groupType)?.label ??
      values.groupType
    )
  }, [groupTypeOptions, values.groupType])

  const linkedPlanName = useMemo(() => {
    return resolveOptionLabel(
      values.linkedPlanId,
      plans,
      values.linkedPlanName,
    )
  }, [plans, values.linkedPlanId, values.linkedPlanName])

  const linkedPlan2Name = useMemo(() => {
    return resolveOptionLabel(
      values.linkedPlan2Id,
      plans,
      values.linkedPlan2Name,
    )
  }, [plans, values.linkedPlan2Id, values.linkedPlan2Name])

  const sections: ReviewSectionConfig[] = useMemo(
    () => [
      {
        id: 'general',
        title: copy.sections.general,
        items: [
          {
            type: 'text',
            label: copy.fields.parentCompany,
            value: parentCompanyName,
          },
          {
            type: 'text',
            label: copy.fields.coverageCode,
            value: coverageCodeName,
          },
          {
            type: 'text',
            label: copy.fields.commissionCode,
            value: commissionCodeName,
          },
          {
            type: 'text',
            label: copy.fields.option,
            value: values.option,
          },
          {
            type: 'text',
            label: copy.fields.name,
            value: values.name,
          },
          {
            type: 'text',
            label: copy.fields.effectiveDate,
            value: values.effectiveDate,
          },
          {
            type: 'text',
            label: copy.fields.groupType,
            value: groupTypeName,
          },
        ],
      },
      {
        id: 'linked',
        title: copy.sections.linked,
        items: [
          {
            type: 'text',
            label: copy.fields.linkedPlan,
            value: linkedPlanName,
          },
          {
            type: 'text',
            label: copy.fields.linkedPlan2,
            value: linkedPlan2Name,
          },
        ],
      },
    ],
    [
      values,
      parentCompanyName,
      coverageCodeName,
      commissionCodeName,
      groupTypeName,
      linkedPlanName,
      linkedPlan2Name,
      copy,
    ],
  )

  return (
    <CommonReviewStep
      copy={{
        heading: copy.heading,
        description: copy.description,
        emptyValue: copy.emptyValue,
      }}
      sections={sections}
      layout="cards"
    />
  )
}
