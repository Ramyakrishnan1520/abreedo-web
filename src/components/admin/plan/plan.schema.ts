import { z } from 'zod'

import {
  optionalTextSchema,
  requiredTextSchema,
} from '#/components/admin/common/form-field-schemas.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

const val = PLAN_CONTENT.validation

export const planSchema = z
  .object({
    parentCompanyId: z.string(),
    coverageCodeId: requiredTextSchema(val.coverageCodeRequired),
    commissionCodeId: optionalTextSchema(),
    option: requiredTextSchema(val.optionRequired, {
      max: 50,
      maxMessage: val.optionMax,
    }),
    name: requiredTextSchema(val.nameRequired, {
      max: 100,
      maxMessage: val.nameMax,
    }),
    effectiveDate: requiredTextSchema(val.effectiveDateRequired),
    groupType: requiredTextSchema(val.groupTypeRequired),
    linkedPlanId: optionalTextSchema(),
    linkedPlan2Id: optionalTextSchema(),
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
