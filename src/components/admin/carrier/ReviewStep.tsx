import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'

import type { CarrierFormValues } from '#/components/admin/carrier/carrier.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

export function ReviewStep() {
  const form = useFormContext<CarrierFormValues>()
  const values = form.getValues()
  const copy = CARRIER_CONTENT.reviewStep

  const { data: states = [] } = useGetStates()

  const stateName = useMemo(() => {
    if (!values.state) return undefined
    return states.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values.state])

  const sections: ReviewSectionConfig[] = useMemo(
    () => [
      {
        id: 'general',
        title: copy.sections.general,
        items: [
          { type: 'text', label: copy.fields.name, value: values.name },
          {
            type: 'text',
            label: copy.fields.groupTitle,
            value: values.groupTitle,
          },
          {
            type: 'text',
            label: copy.fields.allowFlexibleDates,
            value: values.allowFlexibleDates ? copy.yes : copy.no,
          },
        ],
      },
      {
        id: 'address',
        title: copy.sections.primaryAddress,
        items: [
          { type: 'text', label: copy.fields.address1, value: values.address1 },
          { type: 'text', label: copy.fields.address2, value: values.address2 },
          { type: 'text', label: copy.fields.city, value: values.city },
          { type: 'text', label: copy.fields.state, value: stateName },
          { type: 'text', label: copy.fields.zip, value: values.zip },
        ],
      },
      {
        id: 'contact',
        title: copy.sections.contact,
        items: [
          {
            type: 'text',
            label: copy.fields.contactFirstName,
            value: values.contactFirstName,
          },
          {
            type: 'text',
            label: copy.fields.contactLastName,
            value: values.contactLastName,
          },
          { type: 'text', label: copy.fields.phone, value: values.phone },
          { type: 'text', label: copy.fields.fax, value: values.fax },
          { type: 'text', label: copy.fields.email, value: values.email },
        ],
      },
    ],
    [values, stateName, copy],
  )

  return (
    <CommonReviewStep
      copy={{
        heading: copy.heading,
        description: copy.description,
        emptyValue: '-',
      }}
      sections={sections}
      layout="cards"
    />
  )
}
