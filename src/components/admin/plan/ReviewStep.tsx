import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { useInfiniteCoverageCodeOptions } from '#/hooks/coverage-code/use-infinite-coverage-code-options.ts'
import { useCommissionCodeOptions } from '#/hooks/commisssion-code/useCommissionCodeOptions'
import { useInfinitePlanOptions } from '#/hooks/plan/use-infinite-plan-options.ts'
import { useGroupTypeOptions } from '#/hooks/plan/useGroupTypeOptions.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import type { PlanFormSchemaValues } from '#/components/admin/plan/plan.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

export function ReviewStep() {
  const form = useFormContext<PlanFormSchemaValues>()
  const values = form.getValues()
  const copy = PLAN_CONTENT.reviewStep

  const { coverageCodes } = useInfiniteCoverageCodeOptions()
  const { options: commissionCodeOptions } = useCommissionCodeOptions()
  const { options: groupTypeOptions } = useGroupTypeOptions()
  const { plans } = useInfinitePlanOptions()

  const coverageCodeName = useMemo(() => {
    if (!values.coverageCodeId) return undefined
    const match = coverageCodes.find(
      (cc) => String(cc.id) === String(values.coverageCodeId),
    )
    return match ? match.description || match.code : values.coverageCodeId
  }, [coverageCodes, values.coverageCodeId])

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
    if (!values.linkedPlanId) return undefined
    return (
      plans.find((p) => String(p.id) === String(values.linkedPlanId))?.name ??
      values.linkedPlanId
    )
  }, [plans, values.linkedPlanId])

  const linkedPlan2Name = useMemo(() => {
    if (!values.linkedPlan2Id) return undefined
    return (
      plans.find((p) => String(p.id) === String(values.linkedPlan2Id))?.name ??
      values.linkedPlan2Id
    )
  }, [plans, values.linkedPlan2Id])

  const sections: ReviewSectionConfig[] = useMemo(
    () => [
      {
        id: 'general',
        title: copy.sections.general,
        items: [
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
