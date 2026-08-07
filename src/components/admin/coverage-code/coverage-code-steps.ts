import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'

export interface CoverageCodeStep {
  id: string
  label: string
  index: number
}

export const COVERAGE_CODE_DEFAULT_VALUES: CoverageCodeFormValues = {
  code: '',
  name: '',
  carrierId: '',
  coverageClassId: '',
  codeInvoice: '',
  invoiceInclude: false,
  codeReport: '',
  title: '',
  shortTitle: '',
  remittanceTypeId: '',
  invoiceGroup: '',
  notes: '',
}

export const COVERAGE_CODE_STEPS: readonly CoverageCodeStep[] =
  COVERAGE_CODE_CONTENT.form.steps
