export interface Employer {
  id: string
  name: string
  parentCompanyId: string
  parentCompanyName: string
}

export interface EmployerLinkedCarrier {
  carrierId: string
  name: string
}

export interface PlanRateItem {
  id?: string
  planRateId?: string
  effectiveDate: string
  individual?: number | null
  family?: number | null
  husbandWife?: number | null
  parentChild?: number | null
  parentChildren?: number | null
}

export interface EmployerPlanRatePayload {
  effectiveDate: string
  individual?: number | null
  family?: number | null
  husbandWife?: number | null
  parentChild?: number | null
  parentChildren?: number | null
}

export interface EmployerPlanUpdateRequest {
  planId: string
  cgnGroupNumber?: string | null
  brokerCodeId?: string | null
  billerAccountNumber?: string | null
  cgnCustomerNumber?: string | null
  isActive?: boolean
  planRates: EmployerPlanRatePayload[]
}

export interface EmployerPlanPayloadItem {
  planId: string
  cgnGroupNumber?: string | null
  brokerCodeId?: string | null
  billerAccountNumber?: string | null
  cgnCustomerNumber?: string | null
  isActive?: boolean
  planRates: EmployerPlanRatePayload[]
}

export interface EmployerPlansCreateRequest {
  plans: EmployerPlanPayloadItem[]
}

export interface EmployerApiItem {
  employerId: string
  id?: string
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
  isPaper?: boolean
  isPano?: boolean
  carrierIds?: string[] | null
  carriers?: EmployerLinkedCarrier[] | null
  groupNumber?: string | null
  status?: number | null
  policyNumber?: string | null
  tpacNumber?: string | null
  customerNumber?: string | null
  monthlyAdminFee?: number | null
  renewalDate?: string | null
  initialNotificationStartOn?: string | null
  groupPlan?: string | null
  groupTypeId?: string | null
  groupNotes?: string | null
  carrierGroupNumberId?: string | null
  planId?: string | null
  planName?: string | null
  cgnGroupNumber?: string | null
  brokerCodeId?: string | null
  brokerCodeName?: string | null
  billerAccountNumber?: string | null
  cgnCustomerNumber?: string | null
  employerGroupId?: string | null
  groupId?: string | null
  isActive?: boolean | null
  planRates?: PlanRateItem[] | null
}

export interface CarrierGroupNumberItem {
  id?: string
  carrierGroupNumberId?: string
  planId?: string
  planName?: string
  name?: string
  coverageCode?: string
  coverageCodeTitle?: string
  coverageCodeName?: string
  option?: string
  groupNumber?: string
  cgnGroupNumber?: string
  billerAccountNumber?: string
  customerNumber?: string
  cgnCustomerNumber?: string
  brokerCodeId?: string
  brokerCodeName?: string
  isActive?: boolean | null
  groupId?: string | null
  employerGroupId?: string | null
  planRates?: PlanRateItem[] | null
}

export interface EmployerPlanItem {
  id?: string
  carrierGroupNumberId?: string
  planId?: string
  planName?: string
  name?: string
  cgnGroupNumber?: string
  groupNumber?: string
  billerAccountNumber?: string | null
  cgnCustomerNumber?: string | null
  customerNumber?: string | null
  brokerCodeId?: string | null
  brokerCodeName?: string | null
  isActive?: boolean | null
  planRates?: PlanRateItem[] | null
}

export interface EmployerPlansResponse {
  items: EmployerPlanItem[]
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export interface EmployerUpsertRequest {
  name: string
  parentCompanyId?: string | null
  address1: string
  address2?: string | null
  city: string
  state?: string | null
  zip: string
  contactFirst: string
  contactLast: string
  title?: string | null
  phone?: string | null
  fax?: string | null
  email?: string | null
  notes?: string | null
  allowCobra?: boolean
  isPaper?: boolean
  isPano?: boolean
  carrierIds?: string[] | null
  groupNumber: string
  status?: number
  policyNumber?: string | null
  tpacNumber?: string | null
  customerNumber?: string | null
  monthlyAdminFee?: number | null
  renewalDate?: string | null
  initialNotificationStartOn?: string | null
  groupPlan?: string | null
  groupTypeId?: string | null
  groupNotes?: string | null
  plans?: EmployerPlanPayloadItem[]
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

export type EmployerListResponse =
  | EmployerApiItem[]
  | EmployerPaginatedListResponse
