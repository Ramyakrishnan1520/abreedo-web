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
      return ['groupNumber']
    case 3:
      return ['carrierIds']
    case 4:
      return []
    case 5:
      return ['planId', 'cgnGroupNumber', 'billerAccountNumber']
    case 6:
      return ['planRates']
    case 7:
      return []
    default:
      return []
  }
}
