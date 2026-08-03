import type {
  ParentCompanyApiItem,
  ParentCompanyFormValues,
} from '#/types/parent-company.ts'

export function mapParentCompanyDetailToFormValues(
  detail: ParentCompanyApiItem,
): ParentCompanyFormValues {
  return {
    name: detail.name ?? '',
    address1: detail.address1 ?? '',
    address2: detail.address2 ?? '',
    city: detail.city ?? '',
    state: detail.state ?? '',
    zipCode: detail.zip ?? detail.zipCode ?? '',
    contact: {
      firstName: detail.contactFirst ?? detail.contact?.firstName ?? '',
      lastName: detail.contactLast ?? detail.contact?.lastName ?? '',
      phoneNumber: detail.phone ?? detail.contact?.phoneNumber ?? '',
      alternativePhoneNumber:
        detail.alternatePhone ?? detail.contact?.alternativePhoneNumber ?? '',
      fax: detail.fax ?? detail.contact?.fax ?? '',
      email: detail.email ?? detail.contact?.email ?? '',
      website: detail.website ?? detail.contact?.website ?? '',
    },
    carrierIds: detail.carrierIds ?? [],
    notes: detail.notes ?? '',
  }
}
