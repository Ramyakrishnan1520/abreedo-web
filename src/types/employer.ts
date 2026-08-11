export interface Employer {
  id: string
  name: string
  parentCompanyId: string
  parentCompanyName: string
}

export interface EmployerApiItem {
  employerId: string
  name?: string | null
  parentCompanyId?: string | null
  parentCompanyName?: string | null
  address1?: string | null
  address2?: string | null
  contactFirst?: string | null
  contactLast?: string | null
  title?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  phone?: string | null
  fax?: string | null
  email?: string | null
  notes?: string | null
  allowCobra?: boolean
  isPano?: boolean
}

export type EmployerPaginatedListResponse = {
  data?: EmployerApiItem[]
  employers?: EmployerApiItem[]
  items?: EmployerApiItem[]
  results?: EmployerApiItem[]
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export type EmployerListResponse = EmployerApiItem[] | EmployerPaginatedListResponse
