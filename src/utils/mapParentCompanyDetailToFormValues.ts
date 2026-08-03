import type {
  ParentCompanyApiItem,
  ParentCompanyFormValues,
} from '#/types/parent-company.ts'

export function mapParentCompanyDetailToFormValues(
  detail: ParentCompanyApiItem,
): ParentCompanyFormValues {
  const linkedCarriers =
    detail.carriers
      ?.map((carrier) => ({
        id: carrier.carrierId,
        name: carrier.name,
      }))
      .filter((carrier) => carrier.id.length > 0) ?? []

  const carrierIdsFromLinks = linkedCarriers.map((carrier) => carrier.id)
  const carrierIds =
    detail.carrierIds && detail.carrierIds.length > 0
      ? detail.carrierIds
      : carrierIdsFromLinks

  return {
    name: detail.name ?? '',
    fullName:detail.fullName ?? '',
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
    carrierIds,
    linkedCarriers: linkedCarriers.length > 0 ? linkedCarriers : undefined,
    notes: detail.notes ?? '',
    allowCobra:detail.allowCobra ?? '',
  }
}
