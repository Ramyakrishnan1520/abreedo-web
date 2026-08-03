import type { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

import { Badge } from '#/components/ui/badge.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

const copy = PARENT_COMPANY_CONTENT.reviewStep

function ReviewField({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-slate-600">{label}</dt>
      <dd className="text-sm text-slate-900">
        {value?.trim() ? value : copy.emptyValue}
      </dd>
    </div>
  )
}

function ReviewSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Card className="gap-0 py-0 shadow-xs">
      <CardHeader className="border-b border-slate-200 px-5 py-4">
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-4">{children}</CardContent>
    </Card>
  )
}

export function ReviewStep() {
  const form = useFormContext<ParentCompanyFormValues>()
  const values = form.getValues()
  const { carriers } = useAvailableCarriers()
  const { data: states } = useGetStates()

  const getStateName = (stateId: string) =>
    states?.find((state) => state.id === stateId)?.name ?? stateId

  const selectedCarrierNames = resolveSelectedCarrierOptions(
    values.carrierIds,
    carriers,
    values.linkedCarriers ?? [],
  )

  const { sections, fields } = copy

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">{copy.heading}</h3>
        <p className="mt-1 text-sm text-slate-600">{copy.description}</p>
      </div>

      <Separator />

      <ReviewSection title={sections.general}>
        <ReviewField label={fields.name} value={values.name} />
        <ReviewField label={fields.fullName} value={values.fullName}/>
      </ReviewSection>

      <ReviewSection title={sections.primaryAddress}>
        <ReviewField label={fields.address1} value={values.address1} />
        <ReviewField label={fields.address2} value={values.address2} />
        <ReviewField label={fields.city} value={values.city} />
        <ReviewField label={fields.state} value={getStateName(values.state)} />
        <ReviewField label={fields.zipCode} value={values.zipCode} />
      </ReviewSection>

      <ReviewSection title={sections.contact}>
        <ReviewField label={fields.firstName} value={values.contact.firstName} />
        <ReviewField label={fields.lastName} value={values.contact.lastName} />
        <ReviewField label={fields.phone} value={values.contact.phoneNumber} />
        <ReviewField
          label={fields.alternativePhone}
          value={values.contact.alternativePhoneNumber}
        />
        <ReviewField label={fields.fax} value={values.contact.fax} />
        <ReviewField label={fields.email} value={values.contact.email} />
        <ReviewField label={fields.website} value={values.contact.website} />
      </ReviewSection>

      <ReviewSection title={sections.carriers}>
        {selectedCarrierNames.length === 0 ? (
          <p className="text-sm text-slate-500">{copy.noCarriersSelected}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedCarrierNames.map((carrier) => (
              <Badge key={carrier.id} variant="secondary">
                {carrier.name}
              </Badge>
            ))}
          </div>
        )}
      </ReviewSection>

      <ReviewField label="Allow Cobra" value={values.allowCobra ? 'Yes' : 'No'} />
      <ReviewSection title={sections.notes}>
        <p className="text-sm whitespace-pre-wrap text-slate-900">
          {values.notes.trim() ? values.notes : copy.emptyValue}
        </p>
      </ReviewSection>
    </div>
  )
}
