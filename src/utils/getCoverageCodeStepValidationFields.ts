import type { FieldPath } from 'react-hook-form'

import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'

export function getCoverageCodeStepValidationFields(
  stepIndex: number,
): FieldPath<CoverageCodeFormValues>[] {
  switch (stepIndex) {
    case 0:
      return ['code', 'name', 'carrierId', 'coverageClassId', 'remittanceTypeId']
    case 1:
      return [
        'codeInvoice',
        'codeReport',
        'invoiceInclude',
        'title',
        'shortTitle',
        'invoiceGroup',
      ]
    case 2:
      return ['notes']
    case 3:
    default:
      return []
  }
}
