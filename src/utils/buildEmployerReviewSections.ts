import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerFormValues, PlanRateFormItem } from '#/components/admin/employer/employer.schema.ts'
import type { CarrierGroupNumberItem, EmployerPlanItem, PlanRateItem } from '#/types/employer.ts'
import type { AvailableCarrierOption } from '#/types/parent-company.ts'
import type { ReviewItem, ReviewSectionConfig } from '#/types/review-steps.ts'

const reviewCopy = EMPLOYER_CONTENT.reviewStep
const { sections: sectionTitles, fields } = reviewCopy

export interface BuildEmployerGeneralSectionsOptions {
  parentCompanyName?: string
  stateName?: string
  selectedCarrierNames?: AvailableCarrierOption[] | string[]
}


export function buildEmployerGeneralReviewSections(
  values: Partial<EmployerFormValues> | null | undefined,
  options: BuildEmployerGeneralSectionsOptions = {},
): ReviewSectionConfig[] {
  if (!values) return []

  const { parentCompanyName, stateName, selectedCarrierNames = [] } = options

  return [
    {
      id: 'general',
      title: sectionTitles.general,
      items: [
        { type: 'text', label: fields.name, value: values.name },
        {
          type: 'text',
          label: fields.parentCompany,
          value: parentCompanyName || values.parentCompanyName || values.parentCompanyId,
        },
      ],
    },
    {
      id: 'address',
      title: sectionTitles.primaryAddress,
      items: [
        { type: 'text', label: fields.address1, value: values.address1 },
        { type: 'text', label: fields.address2, value: values.address2 },
        { type: 'text', label: fields.city, value: values.city },
        { type: 'text', label: fields.state, value: stateName },
        { type: 'text', label: fields.zip, value: values.zip },
      ],
    },
    {
      id: 'contact',
      title: sectionTitles.contact,
      items: [
        {
          type: 'text',
          label: fields.contactFirstName,
          value: values.contactFirst,
        },
        {
          type: 'text',
          label: fields.contactLastName,
          value: values.contactLast,
        },
        {
          type: 'text',
          label: fields.contactTitle,
          value: values.contactTitle,
        },
        { type: 'text', label: fields.phone, value: values.phone },
        { type: 'text', label: fields.fax, value: values.fax },
        { type: 'text', label: fields.email, value: values.email },
      ],
    },
    {
      id: 'configuration',
      title: sectionTitles.configuration,
      items: [
        {
          type: 'text',
          label: fields.groupNumber,
          value: values.groupNumber,
        },
        {
          type: 'text',
          label: fields.policyNumber,
          value: values.policyNumber,
        },
        {
          type: 'text',
          label: fields.tpacNumber,
          value: values.tpacNumber,
        },
        {
          type: 'text',
          label: fields.monthlyAdminFee,
          value:
            values.monthlyAdminFee !== undefined && values.monthlyAdminFee !== null
              ? `$${values.monthlyAdminFee}`
              : undefined,
        },
        {
          type: 'text',
          label: fields.status,
          value: values.status === 1 ? reviewCopy.yes : reviewCopy.no,
        },
        {
          type: 'text',
          label: fields.isPaper,
          value: values.isPaper ? reviewCopy.yes : reviewCopy.no,
        },
        {
          type: 'text',
          label: fields.allowCobra,
          value: values.allowCobra ? reviewCopy.yes : reviewCopy.no,
        },
        {
          type: 'text',
          label: fields.isPano,
          value: values.isPano ? reviewCopy.yes : reviewCopy.no,
        },
        {
          type: 'text',
          label: fields.renewalDate,
          value: values.renewalDate,
        },
        {
          type: 'text',
          label: fields.initialNotificationStartOn,
          value: values.initialNotificationStartOn,
        },
      ],
    },
    {
      id: 'carriers',
      title: sectionTitles.carriers,
      items: [
        {
          type: 'badges',
          items: selectedCarrierNames.map((c) =>
            typeof c === 'string' ? { id: c, name: c } : c,
          ),
          emptyMessage: reviewCopy.noCarriersSelected,
        },
      ],
    },
    {
      id: 'notes',
      title: sectionTitles.notes,
      items: [
        {
          type: 'text',
          label: fields.notesTitle,
          value: values.notesTitle,
        },
        {
          type: 'multiline',
          value: values.notes,
        },
      ],
    },
  ]
}

/**
 * Builds review items for an array of plan rate items
 */
export function buildPlanRateReviewItems(
  rates?: PlanRateItem[] | PlanRateFormItem[] | null,
): ReviewItem[] {
  if (!rates || rates.length === 0) {
    return [
      {
        type: 'subheading' as const,
        title: sectionTitles.rates,
      },
      {
        type: 'text' as const,
        label: sectionTitles.rates,
        value: reviewCopy.noRatesConfigured,
      },
    ]
  }

  return rates.flatMap((rate, index) => [
    {
      type: 'subheading' as const,
      title: `RATE ${index + 1}`,
    },
    {
      type: 'row' as const,
      label: fields.effectiveDate,
      value: rate.effectiveDate
        ? rate.effectiveDate.split('T')[0]
        : reviewCopy.emptyValue,
    },
    {
      type: 'row' as const,
      label: fields.individual,
      value:
        rate.individual !== undefined && rate.individual !== null
          ? String(rate.individual)
          : reviewCopy.emptyValue,
    },
    {
      type: 'row' as const,
      label: fields.parentChild,
      value:
        rate.parentChild !== undefined && rate.parentChild !== null
          ? String(rate.parentChild)
          : reviewCopy.emptyValue,
    },
    {
      type: 'row' as const,
      label: fields.parentChildren,
      value:
        rate.parentChildren !== undefined && rate.parentChildren !== null
          ? String(rate.parentChildren)
          : reviewCopy.emptyValue,
    },
    {
      type: 'row' as const,
      label: fields.memberSpouse,
      value:
        rate.husbandWife !== undefined && rate.husbandWife !== null
          ? String(rate.husbandWife)
          : reviewCopy.emptyValue,
    },
    {
      type: 'row' as const,
      label: fields.family,
      value:
        rate.family !== undefined && rate.family !== null
          ? String(rate.family)
          : reviewCopy.emptyValue,
    },
  ])
}

export interface ReviewPlanItemInput {
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
  rates?: PlanRateFormItem[] | null
}

/**
 * Builds review section configs for a list of plans and their rates
 */
export function buildEmployerPlanReviewSections(
  plans?: ReviewPlanItemInput[] | CarrierGroupNumberItem[] | EmployerPlanItem[] | null,
): ReviewSectionConfig[] {
  if (!plans || plans.length === 0) {
    return [
      {
        id: 'plan-empty',
        title: sectionTitles.plan,
        items: [
          {
            type: 'text' as const,
            label: sectionTitles.plan,
            value: reviewCopy.noPlansConfigured,
          },
        ],
      },
    ]
  }

  return plans.map((plan, planIndex) => {
    const planName = plan.planName || (plan as { name?: string }).name || plan.planId || 'Plan'
    const groupNumber = plan.cgnGroupNumber || plan.groupNumber || ''
    const planTitle = `${fields.plan}${plans.length > 1 ? ` ${planIndex + 1}` : ''}: ${planName}${groupNumber ? ` (${groupNumber})` : ''}`
    const rates =
      ('rates' in plan && plan.rates ? plan.rates : plan.planRates) ?? []

    const planItems: ReviewItem[] = [
      {
        type: 'text',
        label: fields.plan,
        value: planName,
      },
      {
        type: 'text',
        label: fields.planGroupNumber,
        value: groupNumber,
      },
      {
        type: 'text',
        label: fields.billerAccountNumber,
        value: plan.billerAccountNumber,
      },
      {
        type: 'text',
        label: fields.customerNumber,
        value: plan.cgnCustomerNumber ?? plan.customerNumber,
      },
      {
        type: 'text',
        label: fields.brokerCode,
        value: plan.brokerCodeName || plan.brokerCodeId,
      },
      {
        type: 'text',
        label: fields.isActive,
        value: (plan.isActive ?? true) ? reviewCopy.yes : reviewCopy.no,
      },
    ]

    const rateItems = buildPlanRateReviewItems(rates)

    return {
      id: `plan-${plan.carrierGroupNumberId || plan.planId || planIndex}`,
      title: planTitle,
      items: [...planItems, ...rateItems],
    }
  })
}
