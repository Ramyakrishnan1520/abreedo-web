import type { FieldPath } from 'react-hook-form'

import type { CarrierFormValues } from '#/components/admin/carrier/carrier.schema.ts'

export function getCarrierStepValidationFields(
  stepIndex: number,
): FieldPath<CarrierFormValues>[] {
  switch (stepIndex) {
    case 0:
      return [
        'name',
        'groupTitle',
        'allowFlexibleDates',
        'address1',
        'address2',
        'city',
        'state',
        'zip',
      ]
    case 1:
      return ['contactFirstName', 'contactLastName', 'phone', 'fax', 'email']
    case 2:
    default:
      return []
  }
}
