import { z } from 'zod'

import {
  optionalNotesSchema,
  optionalTextSchema,
  requiredTextSchema,
} from '#/components/admin/common/form-field-schemas.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'

const { validation: v } = COVERAGE_CODE_CONTENT

export const coverageCodeSchema = z.object({
  code: requiredTextSchema(v.codeRequired, { max: 50, maxMessage: v.codeMax }),
  name: requiredTextSchema(v.nameRequired, { max: 100, maxMessage: v.nameMax }),
  carrierId: requiredTextSchema(v.carrierRequired),
  carrierName: optionalTextSchema(),
  coverageClassId: requiredTextSchema(v.coverageClassRequired),
  codeInvoice: requiredTextSchema(v.combinationForBillRequired, {
    max: 3,
    maxMessage: v.combinationForBillMax,
  }),
  invoiceInclude: z.boolean(),
  codeReport: requiredTextSchema(v.combinationForReportsRequired, {
    max: 3,
    maxMessage: v.combinationForReportsMax,
  }),
  title: requiredTextSchema(v.descriptionRequired, {
    max: 250,
    maxMessage: v.descriptionMax,
  }),
  shortTitle: requiredTextSchema(v.shortDescriptionRequired, {
    max: 100,
    maxMessage: v.shortDescriptionMax,
  }),
  remittanceTypeId: requiredTextSchema(v.remittanceTypeRequired),
  invoiceGroup: requiredTextSchema(v.invoiceGroupRequired, {
    max: 100,
    maxMessage: v.invoiceGroupMax,
  }),
  notes: optionalNotesSchema(),
})

export type CoverageCodeFormValues = z.infer<typeof coverageCodeSchema>
