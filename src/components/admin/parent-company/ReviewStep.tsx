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
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

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
      <dd className="text-sm text-slate-900">{value?.trim() ? value : '—'}</dd>
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

  const selectedCarrierNames = [...new Set(values.carrierIds)]
    .map((id) => carriers.find((carrier) => carrier.id === id))
    .filter((carrier): carrier is (typeof carriers)[number] => Boolean(carrier))

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">Review &amp; Save</h3>
        <p className="mt-1 text-sm text-slate-600">
          Confirm all details before creating the parent company.
        </p>
      </div>

      <Separator />

      <ReviewSection title="General">
        <ReviewField label="Parent Company Name" value={values.name} />
        <ReviewField label="Full Name" value={values.fullName} />
      </ReviewSection>

      <ReviewSection title="Primary Address">
        <ReviewField label="Address 1" value={values.address1} />
        <ReviewField label="Address 2" value={values.address2} />
        <ReviewField label="City" value={values.city} />
        <ReviewField label="State" value={getStateName(values.state)} />
        <ReviewField label="Zip Code" value={values.zipCode} />
      </ReviewSection>

      <ReviewSection title="Contact Information">
        <ReviewField label="First Name" value={values.contact.firstName} />
        <ReviewField label="Last Name" value={values.contact.lastName} />
        <ReviewField label="Phone" value={values.contact.phoneNumber} />
        <ReviewField
          label="Alternative Phone"
          value={values.contact.alternativePhoneNumber}
        />
        <ReviewField label="Fax" value={values.contact.fax} />
        <ReviewField label="Email" value={values.contact.email} />
        <ReviewField label="Website" value={values.contact.website} />
      </ReviewSection>

      <ReviewSection title="Selected Carriers">
        {selectedCarrierNames.length === 0 ? (
          <p className="text-sm text-slate-500">No carriers selected.</p>
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

      <ReviewSection title="Important Notes">
        <ReviewField label="Allow Cobra" value={values.allowCobra ? 'Yes' : 'No'} />
        <p className="text-sm whitespace-pre-wrap text-slate-900">
          {values.notes.trim() ? values.notes : '—'}
        </p>
      </ReviewSection>
    </div>
  )
}
