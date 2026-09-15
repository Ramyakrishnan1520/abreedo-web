import { formatEffectiveDate } from '#/utils/formatters.ts'
import type {
  EmployerFormValues,
  PlanRateFormItem,
} from '#/components/admin/employer/employer.schema.ts'
import type {
  EmployerPlanRatePayload,
  EmployerPlansCreateRequest,
  EmployerPlanUpdateRequest,
  EmployerUpsertRequest,
} from '#/types/employer.ts'


export function mapPlanRatesToPayload(
  rates?: PlanRateFormItem[] | null,
): EmployerPlanRatePayload[] {
  if (!rates || rates.length === 0) return []
  return rates.map((rate) => ({
    effectiveDate: formatEffectiveDate(rate.effectiveDate),
    individual: rate.individual ?? 0,
    family: rate.family ?? 0,
    husbandWife: rate.husbandWife ?? 0,
    parentChild: rate.parentChild ?? 0,
    parentChildren: rate.parentChildren ?? 0,
  }))
}


export function mapFormToGeneralUpsertPayload(
  data: EmployerFormValues,
): EmployerUpsertRequest {
  return {
    name: data.name,
    parentCompanyId: data.parentCompanyId || null,
    address1: data.address1,
    address2: data.address2 || null,
    city: data.city,
    state: data.state || null,
    zip: data.zip,

    contactFirst: data.contactFirst,
    contactLast: data.contactLast,
    title: data.contactTitle || null,
    phone: data.phone || null,
    fax: data.fax || null,
    email: data.email || null,

    carrierIds: data.carrierIds,

    groupNumber: data.groupNumber,
    policyNumber: data.policyNumber || null,
    tpacNumber: data.tpacNumber || null,
    monthlyAdminFee: data.monthlyAdminFee ?? null,
    status: data.status,
    isPaper: data.isPaper,
    allowCobra: data.allowCobra,
    isPano: data.isPano,
    renewalDate: data.renewalDate || null,
    initialNotificationStartOn: data.initialNotificationStartOn || null,

    notes: data.notes || null,
  }
}

/**
 * Maps multi-plan form values to EmployerPlansCreateRequest for adding plans
 */
export function mapFormToAddPlansPayload(
  data: EmployerFormValues,
): EmployerPlansCreateRequest {
  const configuredPlans =
    data.plans && data.plans.length > 0
      ? data.plans
      : data.planId
        ? [
            {
              planId: data.planId,
              cgnGroupNumber: data.cgnGroupNumber || '',
              brokerCodeId: data.brokerCodeId || '',
              billerAccountNumber: data.billerAccountNumber || '',
              cgnCustomerNumber: data.cgnCustomerNumber || '',
              isActive: data.isActive ?? true,
              rates: data.planRates ?? [],
            },
          ]
        : []

  return {
    plans: configuredPlans.map((p) => ({
      planId: p.planId,
      cgnGroupNumber: p.cgnGroupNumber || null,
      brokerCodeId: p.brokerCodeId || null,
      billerAccountNumber: p.billerAccountNumber || null,
      cgnCustomerNumber: p.cgnCustomerNumber || null,
      isActive: p.isActive ?? true,
      planRates: mapPlanRatesToPayload(p.rates),
    })),
  }
}

/**
 * Maps single plan edit values to EmployerPlanUpdateRequest
 */
export function mapFormToPlanUpdatePayload(
  data: EmployerFormValues,
): EmployerPlanUpdateRequest {
  return {
    planId: data.planId || '',
    cgnGroupNumber: data.cgnGroupNumber || null,
    brokerCodeId: data.brokerCodeId || null,
    billerAccountNumber: data.billerAccountNumber || null,
    cgnCustomerNumber: data.cgnCustomerNumber || null,
    isActive: data.isActive ?? true,
    planRates: mapPlanRatesToPayload(data.planRates),
  }
}

/**
 * Maps all form values to EmployerUpsertRequest for full employer creation
 */
export function mapFormToCreateEmployerPayload(
  data: EmployerFormValues,
): EmployerUpsertRequest {
  const generalPayload = mapFormToGeneralUpsertPayload(data)
  const primaryPlan = data.plans && data.plans.length > 0 ? data.plans[0] : null

  return {
    ...generalPayload,
    planId: (primaryPlan ? primaryPlan.planId : data.planId) || null,
    cgnGroupNumber:
      (primaryPlan ? primaryPlan.cgnGroupNumber : data.cgnGroupNumber) || null,
    billerAccountNumber:
      (primaryPlan
        ? primaryPlan.billerAccountNumber
        : data.billerAccountNumber) || null,
    cgnCustomerNumber:
      (primaryPlan
        ? primaryPlan.cgnCustomerNumber
        : data.cgnCustomerNumber) || null,
    brokerCodeId:
      (primaryPlan ? primaryPlan.brokerCodeId : data.brokerCodeId) || null,
    isActive:
      (primaryPlan ? primaryPlan.isActive : data.isActive) ?? true,
    planRates: primaryPlan
      ? mapPlanRatesToPayload(primaryPlan.rates)
      : mapPlanRatesToPayload(data.planRates),
  }
}
