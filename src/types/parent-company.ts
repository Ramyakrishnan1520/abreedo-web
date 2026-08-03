export interface ParentCompany {
  id: string
  name: string
  contactName: string
  phone: string
  email: string
}

export interface ParentCompanyListItem {
  id: string
  name: string
}

export interface ParentCompanyLinkedCarrier {
  carrierId: string
  name: string
  groupNumber?: string
}

export interface ParentCompanyApiItem {
  parentCompanyId?: string
  id?: string
  name: string
  contactFirst?: string
  contactLast?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  zipCode?: string
  phone?: string
  alternatePhone?: string
  notes?: string
  email?: string
  fax?: string
  website?: string
  isCreateInvoice?: boolean
  isExactDayCoverage?: boolean
  carrierIds?: string[]
  carriers?: ParentCompanyLinkedCarrier[]
  contact?: Partial<ParentCompanyContact>
}

export type ParentCompanyListResponse =
  | ParentCompanyApiItem[]
  | {
      data?: ParentCompanyApiItem[]
      parentCompanies?: ParentCompanyApiItem[]
      items?: ParentCompanyApiItem[]
      results?: ParentCompanyApiItem[]
      page?: number
      pageSize?: number
      totalCount?: number
      totalPages?: number
    }

export interface ParentCompanyContact {
  firstName: string
  lastName: string
  phoneNumber: string
  alternativePhoneNumber: string
  fax: string
  email: string
  website: string
}

export interface ParentCompanyFormValues {
  name: string
  fullName: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  contact: ParentCompanyContact
  carrierIds: string[]
  /** Id/name from GET detail; used to show selections before carrier list pages load */
  linkedCarriers?: AvailableCarrierOption[]
  notes: string
  allowCobra: boolean
}

export type ParentCompanyStepId =
  | 'general'
  | 'contact'
  | 'carriers'
  | 'notes'
  | 'review'

export interface ParentCompanyStep {
  id: ParentCompanyStepId
  label: string
  index: number
}

export interface CarrierListItemProps {
  name: string
  actionLabel: string
  onAction: () => void
  disabled?: boolean
}

export interface AvailableCarrierOption {
  id: string
  name: string
}

export interface CreateParentCompanyRequest {
  name: string
  fullName: string
  contactFirst: string
  contactLast: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  phone: string
  alternatePhone: string
  notes: string
  allowCobra: boolean
  email: string
  fax: string
  website: string
  isCreateInvoice: boolean
  isExactDayCoverage: boolean
  carrierIds: string[]
}

export interface CreateParentCompanyResponse {
  parentCompanyId?: string
}

