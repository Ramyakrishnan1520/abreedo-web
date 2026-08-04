import type {
  CreateParentCompanyRequest,
  ParentCompanyFormValues,
} from '#/types/parent-company.ts'

export function mapParentCompanyFormToRequest(
  values: ParentCompanyFormValues,
): CreateParentCompanyRequest {
  return {
    name: values.name,
    fullName: values.fullName,
    contactFirst: values.contact.firstName,
    contactLast: values.contact.lastName,
    address1: values.address1,
    address2: values.address2,
    city: values.city,
    state: values.state,
    zip: values.zipCode,
    phone: values.contact.phoneNumber,
    alternatePhone: values.contact.alternativePhoneNumber,
    notes: values.notes,
    allowCobra: values.allowCobra,
    email: values.contact.email,
    fax: values.contact.fax,
    website: values.contact.website,
    isCreateInvoice: true,
    isExactDayCoverage: true,
    carrierIds: [...new Set(values.carrierIds)],
  }
}
