import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

export function getEmployerStepValidationFields(
  step: number,
): Array<keyof EmployerFormValues> {
  switch (step) {
    case 0:
      return ['name', 'parentCompanyId', 'address1', 'city', 'zip']
    case 1:
      return ['contactFirst', 'contactLast', 'phone', 'fax', 'email']
    case 2:
      return ['carrierIds']
    case 3:
      return ['groupNumber']
    case 4:
      return []
    case 5:
      return []
    default:
      return []
  }
}
