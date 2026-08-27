export interface TerminationCode {
  id: number | string
  code: string
  name: string
  bcCode?: string
  nepaCode?: string
  cobraNotice: boolean
  actionCode?: number
  cobraTerm?: '18months' | '36months' | 'non-standard' | string
  cobraMonths?: number
  coverageMonth?: number | string
}

export interface CreateTerminationCodeRequest {
  code: string
  name: string
  title?: string
  bcCode?: string
  nepaCode?: string
  actionCode?: number
  cobraNotice?: boolean
  coverageMonth?: number
}

export interface TerminationCodeApiItem {
  id?: number | string
  terminationCodeId?: number | string
  code: string
  name?: string
  title?: string
  bcCode?: string
  nepaCode?: string
  actionCode?: number
  coverageMonth?: number | string
}

export type TerminationCodePaginatedListResponse = {
  data?: TerminationCodeApiItem[]
  terminationCodes?: TerminationCodeApiItem[]
  items?: TerminationCodeApiItem[]
  results?: TerminationCodeApiItem[]
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export type TerminationCodeListResponse =
  | TerminationCodeApiItem[]
  | TerminationCodePaginatedListResponse
