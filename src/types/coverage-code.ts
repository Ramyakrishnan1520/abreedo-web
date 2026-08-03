export interface CoverageCode {
  id: number | string
  code: string
  description: string
  carrierId?: string
  carrierName?: string
  matrixName?: string
}

export interface CoverageClassDto {
  coverageClassId: string
  code: string | null
  name: string | null
  coverageTypeId: string | null
}

export type GetCoverageClassesResponse = CoverageClassDto[]

export interface CoverageTypeDto {
  coverageTypeId: string
  name: string
  code: string
  priority: number
  isCoverage: boolean
}

export type GetCoverageTypesResponse = CoverageTypeDto[]

export interface CoverageCodeBase {
  code: string
  matrixName: string
  title: string
  shortTitle: string
  codeInvoice: string
  codeReport: string
  linkedCode: string
  orderNumber: number
  carrierId: string
  coverageClassId: string
  invoiceInclude: boolean
  remittanceTypeId?: string
  invoiceGroup?: string
}

export interface CoverageCodeUpsertRequest extends CoverageCodeBase {}

export interface CoverageCodeDto extends CoverageCodeBase {
  coverageCodeId: string
}

export interface CoverageCodeDtoPagedResult {
  items: CoverageCodeDto[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface CoverageCodeApiItem {
  coverageCodeId?: number | string
  id?: number | string
  code: string
  title?: string
  description?: string
  matrixName?: string
  carrierId?: string
  carrierName?: string
  coverageClassId?: string
  invoiceInclude?: boolean
  remittanceTypeId?: string
  invoiceGroup?: string
}

export interface CoverageCodePaginatedListResponse {
  data?: CoverageCodeApiItem[]
  coverageCodes?: CoverageCodeApiItem[]
  items?: CoverageCodeApiItem[]
  results?: CoverageCodeApiItem[]
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export type CoverageCodeListResponse =
  | CoverageCodeApiItem[]
  | CoverageCodePaginatedListResponse



