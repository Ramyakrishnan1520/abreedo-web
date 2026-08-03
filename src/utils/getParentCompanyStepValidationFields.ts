import type { FieldPath } from 'react-hook-form'

import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

export function getStepValidationFields(
  stepIndex: number,
): FieldPath<ParentCompanyFormValues>[] {
  switch (stepIndex) {
    case 0:
      return ['name', 'fullName', 'address1', 'address2', 'city', 'state', 'zipCode']
    case 1:
      return [
        'contact.firstName',
        'contact.lastName',
        'contact.phoneNumber',
        'contact.alternativePhoneNumber',
        'contact.fax',
        'contact.email',
      ]
    case 2:
      return ['carrierIds']
    case 3:
      return ['notes', 'allowCobra']
    default:
      return []
  }
}
