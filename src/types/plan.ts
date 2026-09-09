
export interface Plan {
  id: string
  name: string
  code: string
  coverageCodeTitle: string
  option: string
  effectiveDate: string
  carrierId: string
  carrierName: string
}

export interface PlanApiItem {
  planId: string
  code?: string | null
  name?: string | null
  option?: string | null
  carrierId?: string | null
  carrierName?: string | null
  coverageCodeId?: string | null
  coverageCodeTitle?: string | null
  commissionCodeId?: string | null
  commissionCodeName?: string | null
  effectiveDate?: string | null
  obsoleteDate?: string | null
  tobacco?: boolean | null
  parentCompanyId?: string | null
  parentCompanyName?: string | null
  groupTypeId?: string | null
  tierId?: string | null
  linkedPlanId?: string | null
  linkedPlanName?: string | null
  linkedPlan2Id?: string | null
  linkedPlan2Name?: string | null
}

export interface PlanDtoPagedResult {
  items?: PlanApiItem[] | null
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export type PlanListResponse = PlanApiItem[] | PlanDtoPagedResult

export interface GetPlansQueryParams {
  parentCompanyId?: string
  carrierId?: string
  carrierIds?: string[]
  search?: string
  pageIndex: number
  pageSize: number
}

export interface CreatePlanRequest {
  code?: string | null
  name?: string | null
  option?: string | null
  parentCompanyId?: string | null
  coverageCodeId?: string | null
  groupTypeId?: string | null
  tierId?: string | null
  linkedPlanId?: string | null
  linkedPlan2Id?: string | null
  commissionCodeId?: string | null
  effectiveDate?: string | null
  obsoleteDate?: string | null
  isVoluntaryLifeInsurance?: boolean
  flexibleDates?: boolean
  tobacco?: boolean
}

export interface CreatePlanResponse {
  planId?: string
}

export interface PlanFormValues {
  parentCompanyId: string
  coverageCodeId: string
  commissionCodeId?: string
  option: string
  name: string
  effectiveDate: string
  groupType: string
  linkedPlanId?: string
  linkedPlan2Id?: string
}
