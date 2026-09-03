import type { EmployerApiItem } from '#/types/employer.ts'
import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

export function mapEmployerDetailToFormValues(
  detail: EmployerApiItem,
): EmployerFormValues {
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
    parentCompanyId: detail.parentCompanyId ?? '',
    parentCompanyName: detail.parentCompanyName ?? '',
    address1: detail.address1 ?? '',

    address2: detail.address2 ?? '',
    city: detail.city ?? '',
    state: detail.state ?? '',
    zip: detail.zip ?? '',

    contactFirst: detail.contactFirst ?? '',
    contactLast: detail.contactLast ?? '',
    contactTitle: detail.title ?? '',
    phone: detail.phone ?? '',
    fax: detail.fax ?? '',
    email: detail.email ?? '',

    carrierIds,
    linkedCarriers: linkedCarriers.length > 0 ? linkedCarriers : undefined,

    groupNumber: detail.groupNumber ?? '',
    policyNumber: detail.policyNumber ?? '',
    tpacNumber: detail.tpacNumber ?? '',
    monthlyAdminFee: detail.monthlyAdminFee ?? undefined,
    status: detail.status ?? 0,
    isPaper: detail.isPaper ?? false,
    allowCobra: detail.allowCobra ?? false,
    isPano: detail.isPano ?? false,
    renewalDate: detail.renewalDate ?? '',
    initialNotificationStartOn: detail.initialNotificationStartOn ?? '',

    notesTitle: '',
    notes: detail.notes ?? '',

    planId: detail.planId ?? '',
    planName: detail.planName ?? '',
    cgnGroupNumber: detail.cgnGroupNumber ?? '',
    billerAccountNumber: detail.billerAccountNumber ?? '',
    cgnCustomerNumber: detail.cgnCustomerNumber ?? '',
    brokerCodeId: detail.brokerCodeId ?? '',
    brokerCodeName: detail.brokerCodeName ?? '',
    isActive: detail.isActive ?? true,

    planRates:
      detail.planRates?.map((rate) => ({
        id: rate.id,
        planRateId: rate.planRateId,
        effectiveDate: rate.effectiveDate ?? '',
        individual: rate.individual ?? 0,
        parentChild: rate.parentChild ?? 0,
        parentChildren: rate.parentChildren ?? 0,
        husbandWife: rate.husbandWife ?? 0,
        family: rate.family ?? 0,
      })) ?? [],
  }
}
