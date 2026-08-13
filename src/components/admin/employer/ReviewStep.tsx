import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Badge } from '#/components/ui/badge.tsx'
import ReviewSection from '#/components/admin/common/ReviwSection.tsx'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

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

  const { sections, fields } = copy

  const generalItems = [
    { label: fields.name, value: values.name },
    { label: fields.parentCompany, value: parentCompanyName },
  ]

  const addressItems = [
    { label: fields.address1, value: values.address1 },
    { label: fields.address2, value: values.address2 },
    { label: fields.city, value: values.city },
    { label: fields.state, value: values.state },
    { label: fields.zip, value: values.zip },
  ]

  const contactItems = [
    { label: fields.contactFirstName, value: values.contactFirst },
    { label: fields.contactLastName, value: values.contactLast },
    { label: fields.contactTitle, value: values.contactTitle },
    { label: fields.phone, value: values.phone },
    { label: fields.fax, value: values.fax },
    { label: fields.email, value: values.email },
  ]

  const groupItems = [
    { label: fields.groupNumber, value: values.groupNumber },
    { label: fields.policyNumber, value: values.policyNumber },
    { label: fields.tpacNumber, value: values.tpacNumber },
    {
      label: fields.monthlyAdminFee,
      value:
        values.monthlyAdminFee !== undefined
          ? `$${values.monthlyAdminFee}`
          : undefined,
    },
    { label: fields.status, value: values.status === 1 ? copy.yes : copy.no },
    { label: fields.isPaper, value: values.isPaper ? copy.yes : copy.no },
    { label: fields.allowCobra, value: values.allowCobra ? copy.yes : copy.no },
    { label: fields.isPano, value: values.isPano ? copy.yes : copy.no },
    { label: fields.renewalDate, value: values.renewalDate },
    {
      label: fields.initialNotificationStartOn,
      value: values.initialNotificationStartOn,
    },
  ]

  const notesItems = [
    { label: fields.notesTitle, value: values.notesTitle },
    { label: fields.notes, value: values.notes },
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

      <ReviewSection title={sections.groupDetails} items={groupItems} />

      <ReviewSection title={sections.notes} items={notesItems} />
    </div>
  )
}
