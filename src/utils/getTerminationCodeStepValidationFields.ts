import type { TerminationCodeFormValues } from '#/components/admin/termination-code/termination-code.schema.ts'
import type { FieldPath } from 'react-hook-form'

export function getTerminationCodeStepValidationFields(
  stepIndex: number,
): Array<FieldPath<TerminationCodeFormValues>> {
  if (stepIndex === 0) {
    return [
      'code',
      'name',
      'bccCode',
      'nepaCode',
      'cobraNotice',
      'cobraTerm',
      'cobraMonths',
    ]
  }

  return []
}
