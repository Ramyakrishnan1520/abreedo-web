export interface Carrier {
  id: number | string
  name: string
  groupTitle: string
  phone: string
}

export interface CreateCarrierRequest {
  name: string
  groupNumber: string
  contactFirst: string
  contactLast: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  fax: string
  allowFlexibleDates?: boolean
}

export interface CreateCarrierResponse {
  id: string
}

export interface StateItem {
  id: string
  name: string
}

export type GetStatesResponse = StateItem[]

export interface CarrierApiItem {
  carrierId: string
  name: string
  groupNumber: string
  contactFirst: string
  contactLast: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  phone: string
  fax: string
  email: string
  allowFlexibleDates?: boolean
}

export type CarrierPaginatedListResponse = {
  data?: CarrierApiItem[]
  carriers?: CarrierApiItem[]
  items?: CarrierApiItem[]
  results?: CarrierApiItem[]
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export type CarrierListResponse = CarrierApiItem[] | CarrierPaginatedListResponse



