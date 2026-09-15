import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

export type EmployerFormMode = 'create' | 'edit-general' | 'edit-plan' | 'add-plan'

export function getEmployerStepValidationFields(
  step: number,
  mode: EmployerFormMode = 'create',
): Array<keyof EmployerFormValues> {
  if (mode === 'edit-general') {
    switch (step) {
      case 0: 
        return ['name', 'parentCompanyId', 'address1', 'city', 'zip']
      case 1: 
        return ['contactFirst', 'contactLast', 'phone', 'fax', 'email']
      case 2: 
        return ['groupNumber']
      case 3: 
        return ['carrierIds']
      case 4: // Notes
        return []
      case 5: // Review
        return []
      default:
        return []
    }
  }

  if (mode === 'edit-plan') {
    switch (step) {
      case 0:
        return ['planId', 'cgnGroupNumber', 'billerAccountNumber']
      case 1:
        return ['planRates']
      case 2: // Review
        return []
      default:
        return []
    }
  }

  if (mode === 'add-plan') {
    switch (step) {
      case 0:
        return ['plans']
      case 1:
        return ['plans']
      case 2: // Review
        return []
      default:
        return []
    }
  }

  // mode === 'create'
  switch (step) {
    case 0:
      return ['name', 'parentCompanyId', 'address1', 'city', 'zip']
    case 1:
      return ['contactFirst', 'contactLast', 'phone', 'fax', 'email']
    case 2:
      return ['groupNumber']
    case 3:
      return ['carrierIds']
    case 4: // Notes
      return []
    case 5:
      return ['plans']
    case 6:
      return ['plans']
    case 7: // Review
      return []
    default:
      return []
  }
}
