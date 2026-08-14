import { z } from 'zod'

import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

const val = TERMINATION_CODE_CONTENT.validation

export const terminationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, val.codeRequired)
    .max(2, val.codeMax),
  name: z
    .string()
    .trim()
    .min(1, val.nameRequired)
    .max(100, val.nameMax),
  bccCode: z
    .string()
    .trim()
    .max(50, val.bccCodeMax)
    .optional()
    .or(z.literal('')),
  nepaCode: z
    .string()
    .trim()
    .max(50, val.nepaCodeMax)
    .optional()
    .or(z.literal('')),
  cobraNotice: z.boolean().optional(),
  cobraTerm: z.string().optional(),
  cobraMonths: z
    .number()
    .int()
    .min(0, val.cobraMonthsMin)
    .max(120, val.cobraMonthsMax)
    .optional(),
})

export type TerminationCodeFormValues = z.infer<typeof terminationCodeSchema>
