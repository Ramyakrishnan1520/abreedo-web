import { DEFAULT_PARENT_COMPANY_ID } from '#/types/plan.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import type { PlanFormSchemaValues } from '#/components/admin/plan/plan.schema.ts'

export interface PlanStep {
  id: string
  label: string
  index: number
}

export const PLAN_DEFAULT_VALUES: PlanFormSchemaValues = {
  parentCompanyId: DEFAULT_PARENT_COMPANY_ID,
  coverageCodeId: '',
  coverageCodeTitle: '',
  commissionCodeId: '',
  option: '',
  name: '',
  effectiveDate: '',
  groupType: '',
  linkedPlanId: '',
  linkedPlanName: '',
  linkedPlan2Id: '',
  linkedPlan2Name: '',
}


export const PLAN_STEPS: readonly PlanStep[] = PLAN_CONTENT.form.steps
