import { DEFAULT_PARENT_COMPANY_ID, type PlanApiItem } from '#/types/plan.ts'
import type { PlanFormSchemaValues } from '#/components/admin/plan/plan.schema.ts'

export function mapPlanDetailToFormValues(
  detail: PlanApiItem,
): PlanFormSchemaValues {
  return {
    parentCompanyId: detail.parentCompanyId || DEFAULT_PARENT_COMPANY_ID,
    coverageCodeId: detail.coverageCodeId ?? '',
    coverageCodeTitle: detail.coverageCodeTitle ?? '',
    commissionCodeId: detail.commissionCodeId ?? '',
    option: detail.option ?? '',
    name: detail.name ?? '',
    effectiveDate: detail.effectiveDate
      ? detail.effectiveDate.split('T')[0]
      : '',
    groupType: detail.groupTypeId ?? '',
    linkedPlanId: detail.linkedPlanId ?? '',
    linkedPlanName: detail.linkedPlanName ?? '',
    linkedPlan2Id: detail.linkedPlan2Id ?? '',
    linkedPlan2Name: detail.linkedPlan2Name ?? '',
  }
}
