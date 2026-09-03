export interface BrokerCode {
  id: string
  code: string
  name: string
  reportCode?: string | null
  superParentCompanyId?: string | null
  parentCompanyId?: string | null
}

export interface BrokerCodeDto {
  brokerCodeId: string
  code?: string | null
  name?: string | null
  reportCode?: string | null
  superParentCompanyId?: string | null
  parentCompanyId?: string | null
}

export interface BrokerCodeDtoPagedResult {
  items?: BrokerCodeDto[] | null
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export interface GetBrokerCodesQueryParams {
  pageIndex: number
  pageSize: number
  search?: string
  sort?: string
}
