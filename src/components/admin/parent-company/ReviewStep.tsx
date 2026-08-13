import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Badge } from '#/components/ui/badge.tsx'
import ReviewSection from '#/components/admin/common/ReviwSection.tsx'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

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

  const { sections, fields } = copy

  const generalItems = [
    { label: fields.name, value: values.name },
    { label: fields.fullName, value: values.fullName },
  ]

  const addressItems = [
    { label: fields.address1, value: values.address1 },
    { label: fields.address2, value: values.address2 },
    { label: fields.city, value: values.city },
    { label: fields.state, value: stateName },
    { label: fields.zipCode, value: values.zipCode },
  ]

  const contactItems = [
    { label: fields.firstName, value: values.contact.firstName },
    { label: fields.lastName, value: values.contact.lastName },
    { label: fields.phone, value: values.contact.phoneNumber },
    {
      label: fields.alternativePhone,
      value: values.contact.alternativePhoneNumber,
    },
    { label: fields.fax, value: values.contact.fax },
    { label: fields.email, value: values.contact.email },
    { label: fields.website, value: values.contact.website },
  ]

  const notesItems = [
    { label: 'Allow Cobra', value: values.allowCobra ? 'Yes' : 'No' },
    { label: 'Notes', value: values.notes },
  ]

  return (
    <div className="space-y-4">
      <ReviewSection title={sections.general} items={generalItems} />

      <ReviewSection title={sections.primaryAddress} items={addressItems} />

      <ReviewSection title={sections.contact} items={contactItems} />

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-tan-dark">
          {sections.carriers}
        </h4>
        {selectedCarrierNames.length === 0 ? (
          <p className="text-sm text-slate-500">{copy.noCarriersSelected}</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedCarrierNames.map((carrier) => (
              <Badge key={carrier.id} variant="secondary">
                {carrier.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <ReviewSection title={sections.notes} items={notesItems} />
    </div>
  )
}
