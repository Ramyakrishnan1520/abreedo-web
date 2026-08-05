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
  effectiveDate?: string | null
  obsoleteDate?: string | null
  tobacco?: boolean | null
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
  pageIndex: number
  pageSize: number
}
