
export interface LookupCode {
  codeId: string
  codeName: string
  codeValue: string
  lookupId: number
}

export interface LookupCodeApiItem {
  codeId: string
  codeValue?: string | null
  codeName: string
  lookupId: number
}

export type LookupCodeListResponse =
  | LookupCodeApiItem[]
  | {
      data?: LookupCodeApiItem[]
      lookupCodes?: LookupCodeApiItem[]
      items?: LookupCodeApiItem[]
      results?: LookupCodeApiItem[]
    }

/** Group Type values in GET /api/v1/lookup-codes (`lookupId` on each code row). */
export const GROUP_TYPE_LOOKUP_ID = 1