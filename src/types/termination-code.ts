export interface TerminationCode {
  id: number | string
  code: string
  name: string
  bccCode?: string
  nepaCode?: string
  cobraNotice: boolean
  actionCode?: number
  cobraTerm?: '18months' | '36months' | 'non-standard' | string
  cobraMonths?: number
  coverageMonths?: number | string
}

export interface CreateTerminationCodeRequest {
  code: string
  name: string
  title?: string
  bccCode?: string
  nepaCode?: string
  actionCode?: number
  cobraNotice?: boolean
  cobraTerm?: string
  cobraMonths?: number
  coverageMonths?: number
}

export interface TerminationCodeApiItem {
  id?: number | string
  terminationCodeId?: number | string
  code: string
  name?: string
  title?: string
  bccCode?: string
  nepaCode?: string
  actionCode?: number
  coverageMonths?: number | string
  cobraMonths?: number
  cobraTerm?: string
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
