import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import type { CarrierFormValues } from '#/components/admin/carrier/carrier.schema.ts'

export interface CarrierStep {
  id: string
  label: string
  index: number
}

export const CARRIER_DEFAULT_VALUES: CarrierFormValues = {
  name: '',
  groupTitle: '',
  allowFlexibleDates: false,
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  contactFirstName: '',
  contactLastName: '',
  phone: '',
  fax: '',
  email: '',
}

export const CARRIER_STEPS: readonly CarrierStep[] = CARRIER_CONTENT.form.steps
