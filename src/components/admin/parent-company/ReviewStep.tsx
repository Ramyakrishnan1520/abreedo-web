import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'

import type { ParentCompanyFormValues } from '#/types/parent-company.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

const copy = PARENT_COMPANY_CONTENT.reviewStep

export function ReviewStep() {
  const form = useFormContext<ParentCompanyFormValues>()
  const values = form.getValues()
  const { carriers } = useAvailableCarriers()
  const { data: states } = useGetStates()

  const stateName = useMemo(() => {
    if (!values.state) return undefined
    return states?.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values.state])

  const selectedCarrierNames = useMemo(
    () =>
      resolveSelectedCarrierOptions(
        values.carrierIds,
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
          { type: 'text', label: fields.fullName, value: values.fullName },
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
          { type: 'text', label: fields.zipCode, value: values.zipCode },
        ],
      },
      {
        id: 'contact',
        title: sectionTitles.contact,
        items: [
          {
            type: 'text',
            label: fields.firstName,
            value: values.contact.firstName,
          },
          {
            type: 'text',
            label: fields.lastName,
            value: values.contact.lastName,
          },
          {
            type: 'text',
            label: fields.phone,
            value: values.contact.phoneNumber,
          },
          {
            type: 'text',
            label: fields.alternativePhone,
            value: values.contact.alternativePhoneNumber,
          },
          { type: 'text', label: fields.fax, value: values.contact.fax },
          {
            type: 'text',
            label: fields.email,
            value: values.contact.email,
          },
          {
            type: 'text',
            label: fields.website,
            value: values.contact.website,
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
            label: 'Allow Cobra',
            value: values.allowCobra ? 'Yes' : 'No',
          },
          {
            type: 'multiline',
            value: values.notes,
          },
        ],
      },
    ],
    [sectionTitles, fields, values, stateName, selectedCarrierNames],
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
