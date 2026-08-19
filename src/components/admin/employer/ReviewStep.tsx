import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

const copy = EMPLOYER_CONTENT.reviewStep

export function ReviewStep() {
  const form = useFormContext<EmployerFormValues>()
  const values = form.getValues()
  const { carriers } = useAvailableCarriers()
  const { data: parentCompanies = [] } = useParentCompanies()

  const parentCompanyName = useMemo(() => {
    if (!values.parentCompanyId) return undefined
    return (
      parentCompanies.find((company) => company.id === values.parentCompanyId)
        ?.name ?? values.parentCompanyId
    )
  }, [parentCompanies, values.parentCompanyId])

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
          { type: 'text', label: fields.state, value: values.state },
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
        id: 'group',
        title: sectionTitles.groupDetails,
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
