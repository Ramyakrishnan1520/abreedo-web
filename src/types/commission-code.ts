export interface CommissionCodeApiItem {
  commissionCodeId: string
  code?: string | null
  name?: string | null
  reportCode?: string | null
  superParentCompanyId?: string | null
  parentCompanyId?: string | null
}

export interface CommissionCodeListResponse {
  items?: CommissionCodeApiItem[] | null
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}
