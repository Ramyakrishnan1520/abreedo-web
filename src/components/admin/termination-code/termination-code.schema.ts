import { z } from 'zod'

import {
  optionalTextSchema,
  requiredTextSchema,
} from '#/components/admin/common/form-field-schemas.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

const val = TERMINATION_CODE_CONTENT.validation

export const terminationCodeSchema = z.object({
  code: requiredTextSchema(val.codeRequired, {
    max: 2,
    maxMessage: val.codeMax,
  }),
  name: requiredTextSchema(val.nameRequired, {
    max: 100,
    maxMessage: val.nameMax,
  }),
  bcCode: optionalTextSchema({ max: 50, maxMessage: val.bcCodeMax }),
  nepaCode: optionalTextSchema({ max: 50, maxMessage: val.nepaCodeMax }),
  cobraNotice: z.boolean().optional(),
  cobraTerm: optionalTextSchema(),
  cobraMonths: z
    .number()
    .int()
    .min(0, val.cobraMonthsMin)
    .max(120, val.cobraMonthsMax),
})

export type TerminationCodeFormValues = z.infer<typeof terminationCodeSchema>
