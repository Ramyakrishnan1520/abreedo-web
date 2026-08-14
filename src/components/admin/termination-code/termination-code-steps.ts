import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { TerminationCodeFormValues } from '#/components/admin/termination-code/termination-code.schema.ts'

export const TERMINATION_CODE_STEPS =
  TERMINATION_CODE_CONTENT.form.steps

export const TERMINATION_CODE_DEFAULT_VALUES: TerminationCodeFormValues = {
  code: '',
  name: '',
  bccCode: '',
  nepaCode: '',
  cobraNotice: false,
  cobraTerm: '18months',
  cobraMonths: 0,
}
