import type { CarrierApiItem } from '#/types/carrier.ts'
import type { CarrierFormValues } from '#/components/admin/carrier/carrier.schema.ts'

export function mapCarrierDetailToFormValues(
  detail: CarrierApiItem,
): CarrierFormValues {
  return {
    name: detail.name ?? '',
    groupTitle: detail.groupNumber ?? '',
    contactFirstName: detail.contactFirst ?? '',
    contactLastName: detail.contactLast ?? '',
    address1: detail.address1 ?? '',
    address2: detail.address2 ?? '',
    city: detail.city ?? '',
    state: detail.state ?? '',
    zip: detail.zip ?? '',
    phone: detail.phone ?? '',
    fax: detail.fax ?? '',
    email: detail.email ?? '',
    allowFlexibleDates: detail.allowFlexibleDates ?? false,
  }
}
