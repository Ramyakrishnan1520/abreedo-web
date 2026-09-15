import type { CarrierGroupNumberItem, EmployerPlanItem } from '#/types/employer.ts'
import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

export function mapCarrierGroupNumberToFormValues(
  item: CarrierGroupNumberItem | EmployerPlanItem,
): Partial<EmployerFormValues> {
  return {
    planId: item.planId ?? '',
    planName: item.planName ?? item.name ?? '',
    cgnGroupNumber: item.cgnGroupNumber ?? item.groupNumber ?? '',
    billerAccountNumber: item.billerAccountNumber ?? '',
    cgnCustomerNumber: item.cgnCustomerNumber ?? item.customerNumber ?? '',
    brokerCodeId: item.brokerCodeId ?? '',
    brokerCodeName: item.brokerCodeName ?? '',
    isActive: item.isActive ?? true,
    planRates:
      item.planRates?.map((rate) => ({
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
