import type { FieldPath } from 'react-hook-form'

import type { PlanFormSchemaValues } from '#/components/admin/plan/plan.schema.ts'

export function getPlanStepValidationFields(
  stepIndex: number,
): FieldPath<PlanFormSchemaValues>[] {
  switch (stepIndex) {
    case 0:
      return [
        'coverageCodeId',
        'commissionCodeId',
        'option',
        'name',
        'effectiveDate',
        'groupType',
        'linkedPlanId',
        'linkedPlan2Id',
      ]
    case 1:
    default:
      return []
  }
}
