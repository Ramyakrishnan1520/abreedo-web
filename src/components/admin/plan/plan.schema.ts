import { z } from 'zod'

import { PLAN_CONTENT } from '#/utils/plan-content.ts'

const val = PLAN_CONTENT.validation

export const planSchema = z
  .object({
    parentCompanyId: z.string().min(1, val.parentCompanyRequired),
    coverageCodeId: z.string().min(1, val.coverageCodeRequired),
    option: z.string().min(1, val.optionRequired).max(50, val.optionMax),
    name: z.string().min(1, val.nameRequired).max(100, val.nameMax),
    effectiveDate: z.string().min(1, val.effectiveDateRequired),
    groupType: z.string().min(1, val.groupTypeRequired),
    linkedPlanId: z.string().optional(),
    linkedPlan2Id: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.linkedPlanId && data.linkedPlan2Id) {
        return data.linkedPlanId !== data.linkedPlan2Id
      }
      return true
    },
    {
      message: val.linkedPlanDuplicateError,
      path: ['linkedPlan2Id'],
    },
  )

export type PlanFormSchemaValues = z.infer<typeof planSchema>
