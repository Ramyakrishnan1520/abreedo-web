import { z } from 'zod'

import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'

const { validation: v } = COVERAGE_CODE_CONTENT

export const coverageCodeSchema = z.object({
  code: z.string().min(1, v.codeRequired).max(50, v.codeMax).trim(),
  name: z.string().min(1, v.nameRequired).max(100, v.nameMax).trim(),
  carrierId: z.string().min(1, v.carrierRequired).trim(),
  coverageClassId: z.string().min(1, v.coverageClassRequired).trim(),
  codeInvoice: z
    .string()
    .min(1, v.combinationForBillRequired)
    .max(100, v.combinationForBillMax)
    .trim(),
  invoiceInclude: z.boolean(),
  codeReport: z
    .string()
    .min(1, v.combinationForReportsRequired)
    .max(100, v.combinationForReportsMax)
    .trim(),
  title: z
    .string()
    .min(1, v.descriptionRequired)
    .max(250, v.descriptionMax)
    .trim(),
  shortTitle: z
    .string()
    .min(1, v.shortDescriptionRequired)
    .max(100, v.shortDescriptionMax)
    .trim(),
})

export type CoverageCodeFormValues = z.infer<typeof coverageCodeSchema>
