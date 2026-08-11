import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import ReviewSection from '../common/ReviwSection'
import type { CarrierFormValues } from '#/components/admin/carrier/carrier.schema.ts'


export function ReviewStep() {
  const form = useFormContext<CarrierFormValues>()
  const values = form.getValues()
  const copy = CARRIER_CONTENT.reviewStep


  const { data: states = [] } = useGetStates()

  const stateName = useMemo(() => {
    if (!values.state) return undefined
    return states.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values.state])

  const generalItems = [
    { label: copy.fields.name, value: values.name },
    { label: copy.fields.groupTitle, value: values.groupTitle },
    {
      label: copy.fields.allowFlexibleDates,
      value: values.allowFlexibleDates ? copy.yes : copy.no,
    },
  ]

  const addressItems = [
    { label: copy.fields.address1, value: values.address1 },
    { label: copy.fields.address2, value: values.address2 },
    { label: copy.fields.city, value: values.city },
    { label: copy.fields.state, value: stateName },
    { label: copy.fields.zip, value: values.zip },
  ]

  const contactItems = [
    { label: copy.fields.contactFirstName, value: values.contactFirstName },
    { label: copy.fields.contactLastName, value: values.contactLastName },
    { label: copy.fields.phone, value: values.phone },
    { label: copy.fields.fax, value: values.fax },
    { label: copy.fields.email, value: values.email },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">{copy.heading}</h3>
        <p className="text-sm text-slate-500">{copy.description}</p>
      </div>

      <div className="space-y-4">
        <ReviewSection
          title={copy.sections.general}
          items={generalItems}
        />
        <ReviewSection
          title={copy.sections.primaryAddress}
          items={addressItems}
        />
        <ReviewSection
          title={copy.sections.contact}
          items={contactItems}
        />
      </div>
    </div>
  )
}
