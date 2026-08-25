import { z } from 'zod'

import {
  LETTERS_ONLY_REGEX,
  optionalEmailSchema,
  optionalNotesSchema,
  optionalPhoneSchema,
  optionalTextSchema,
  requiredTextSchema,
  zipSchema,
} from '#/components/admin/common/form-field-schemas.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

const { validation: v } = EMPLOYER_CONTENT

export const employerSchema = z.object({
  // General Step
  name: requiredTextSchema(v.nameRequired, {
    max: 100,
    maxMessage: v.nameMax,
  }),
  parentCompanyId: requiredTextSchema(v.parentCompanyRequired),
  parentCompanyName: optionalTextSchema(),
  address1: requiredTextSchema(v.address1Required, {

    max: 200,
    maxMessage: v.addressMax,
  }),
  address2: optionalTextSchema({ max: 200, maxMessage: v.addressMax }),
  city: requiredTextSchema(v.cityRequired, {
    max: 100,
    maxMessage: v.cityMax,
    pattern: LETTERS_ONLY_REGEX,
    patternMessage: v.cityLetters,
  }),
  state: optionalTextSchema(),
  zip: zipSchema(v.zipRequired, v.zipInvalid),

  // Contact Step
  contactFirst: requiredTextSchema(v.contactFirstRequired, {
    max: 50,
    maxMessage: v.contactFirstMax,
    pattern: LETTERS_ONLY_REGEX,
    patternMessage: v.contactFirstLetters,
  }),
  contactLast: requiredTextSchema(v.contactLastRequired, {
    max: 50,
    maxMessage: v.contactLastMax,
    pattern: LETTERS_ONLY_REGEX,
    patternMessage: v.contactLastLetters,
  }),
  contactTitle: optionalTextSchema({
    max: 100,
    maxMessage: v.contactTitleMax,
  }),
  phone: optionalPhoneSchema(v.phoneInvalid),
  fax: optionalPhoneSchema(v.faxInvalid),
  email: optionalEmailSchema(v.emailInvalid, {
    max: 254,
    maxMessage: v.emailMax,
  }),

  // Carriers Step
  carrierIds: z.array(z.string()),
  linkedCarriers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),

  // Company Group Number Step
  groupNumber: requiredTextSchema(v.groupNumberRequired, {
    max: 100,
    maxMessage: v.groupNumberMax,
  }),
  policyNumber: optionalTextSchema({
    max: 100,
    maxMessage: v.policyNumberMax,
  }),
  tpacNumber: optionalTextSchema({
    max: 100,
    maxMessage: v.tpacNumberMax,
  }),
  monthlyAdminFee: z.number().int().nonnegative().optional(),
  status: z.number().optional(),
  isPaper: z.boolean().optional(),
  allowCobra: z.boolean().optional(),
  isPano: z.boolean().optional(),
  renewalDate: optionalTextSchema(),
  initialNotificationStartOn: optionalTextSchema(),

  // Notes Step
  notesTitle: optionalTextSchema({
    max: 200,
    maxMessage: v.notesTitleMax,
  }),
  notes: optionalNotesSchema(),
})

export type EmployerFormValues = z.infer<typeof employerSchema>
