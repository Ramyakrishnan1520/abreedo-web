import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

import { resolveOptionLabel } from '#/utils/resolveOptionLabel.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

const copy = EMPLOYER_CONTENT.reviewStep

export function ReviewStep() {
  const form = useFormContext<EmployerFormValues>()
  const values = form.getValues()
  const { carriers } = useAvailableCarriers()
  const { data: parentCompanies = [] } = useParentCompanies()
  const { data: states = [] } = useGetStates()

  const stateName = useMemo(() => {
    if (!values.state) return undefined
    return states.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values.state])

  const parentCompanyName = useMemo(() => {
    return resolveOptionLabel(
      values.parentCompanyId,
      parentCompanies,
      values.parentCompanyName,
    )
  }, [parentCompanies, values.parentCompanyId, values.parentCompanyName])


  const selectedCarrierNames = useMemo(
    () =>
      resolveSelectedCarrierOptions(
        values.carrierIds ?? [],
        carriers,
        values.linkedCarriers ?? [],
      ),
    [carriers, values.carrierIds, values.linkedCarriers],
  )

  const { sections: sectionTitles, fields } = copy

  const sections: ReviewSectionConfig[] = useMemo(
    () => [
      {
        id: 'general',
        title: sectionTitles.general,
        items: [
          { type: 'text', label: fields.name, value: values.name },
          {
            type: 'text',
            label: fields.parentCompany,
            value: parentCompanyName,
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
              values.monthlyAdminFee !== undefined
                ? `$${values.monthlyAdminFee}`
                : undefined,
          },
          {
            type: 'text',
            label: fields.status,
            value: values.status === 1 ? copy.yes : copy.no,
          },
          {
            type: 'text',
            label: fields.isPaper,
            value: values.isPaper ? copy.yes : copy.no,
          },
          {
            type: 'text',
            label: fields.allowCobra,
            value: values.allowCobra ? copy.yes : copy.no,
          },
          {
            type: 'text',
            label: fields.isPano,
            value: values.isPano ? copy.yes : copy.no,
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
            items: selectedCarrierNames,
            emptyMessage: copy.noCarriersSelected,
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
            label: fields.notes,
            value: values.notes,
          },
        ],
      },
      {
        id: 'plan',
        title: sectionTitles.plan,
        items: [
          {
            type: 'text',
            label: fields.plan,
            value: values.planName || values.planId,
          },
          {
            type: 'text',
            label: fields.planGroupNumber,
            value: values.cgnGroupNumber,
          },
          {
            type: 'text',
            label: fields.billerAccountNumber,
            value: values.billerAccountNumber,
          },
          {
            type: 'text',
            label: fields.customerNumber,
            value: values.cgnCustomerNumber,
          },
          {
            type: 'text',
            label: fields.brokerCode,
            value: values.brokerCodeName || values.brokerCodeId,
          },
          {
            type: 'text',
            label: fields.isActive,
            value: values.isActive ? copy.yes : copy.no,
          },
        ],
      },
      {
        id: 'rates',
        title: sectionTitles.rates,
        items:
          values.planRates && values.planRates.length > 0
            ? values.planRates.flatMap((rate, index) => [
                {
                  type: 'subheading' as const,
                  title: `RATE ${index + 1}`,
                },
                {
                  type: 'row' as const,
                  label: fields.effectiveDate,
                  value: rate.effectiveDate ? rate.effectiveDate.split('T')[0] : copy.emptyValue,
                },
                {
                  type: 'row' as const,
                  label: fields.individual,
                  value:
                    rate.individual !== undefined && rate.individual !== null
                      ? String(rate.individual)
                      : copy.emptyValue,
                },
                {
                  type: 'row' as const,
                  label: fields.parentChild,
                  value:
                    rate.parentChild !== undefined && rate.parentChild !== null
                      ? String(rate.parentChild)
                      : copy.emptyValue,
                },
                {
                  type: 'row' as const,
                  label: fields.parentChildren,
                  value:
                    rate.parentChildren !== undefined && rate.parentChildren !== null
                      ? String(rate.parentChildren)
                      : copy.emptyValue,
                },
                {
                  type: 'row' as const,
                  label: fields.memberSpouse,
                  value:
                    rate.husbandWife !== undefined && rate.husbandWife !== null
                      ? String(rate.husbandWife)
                      : copy.emptyValue,
                },
                {
                  type: 'row' as const,
                  label: fields.family,
                  value:
                    rate.family !== undefined && rate.family !== null
                      ? String(rate.family)
                      : copy.emptyValue,
                },
              ])
            : [
                {
                  type: 'text' as const,
                  label: 'Rates',
                  value: copy.noRatesConfigured,
                },
              ],
      },
    ],
    [sectionTitles, fields, values, parentCompanyName, selectedCarrierNames],
  )

  return (
    <CommonReviewStep
      copy={{
        emptyValue: '—',
      }}
      sections={sections}
      layout="cards"
    />
  )
}
