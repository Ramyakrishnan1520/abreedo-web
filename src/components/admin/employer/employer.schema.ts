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

  // Plan Step
  planId: requiredTextSchema(v.planRequired),
  planName: optionalTextSchema(),
  cgnGroupNumber: requiredTextSchema(v.cgnGroupNumberRequired, {
    max: 100,
  }),
  billerAccountNumber: requiredTextSchema(v.billerAccountNumberRequired, {
    max: 100,
  }),
  cgnCustomerNumber: optionalTextSchema({
    max: 100,
  }),
  brokerCodeId: optionalTextSchema(),
  brokerCodeName: optionalTextSchema(),
  isActive: z.boolean().optional(),

  // Rate Step
  planRates: z
    .array(
      z.object({
        id: z.string().optional(),
        planRateId: z.string().optional(),
        effectiveDate: requiredTextSchema(v.effectiveDateRequired),
        individual: z.number({ message: v.individualRequired }),
        parentChild: z.number({ message: v.parentChildRequired }),
        parentChildren: z.number({ message: v.parentChildrenRequired }),
        husbandWife: z.number({ message: v.memberSpouseRequired }),
        family: z.number({ message: v.familyRequired }),
      }),
    )
    .min(1, v.rateRequiresAtLeastOne),
})

export const employerGeneralEditSchema = employerSchema.extend({
  planId: optionalTextSchema(),
  cgnGroupNumber: optionalTextSchema(),
  billerAccountNumber: optionalTextSchema(),
  planRates: z
    .array(
      z.object({
        id: z.string().optional(),
        planRateId: z.string().optional(),
        effectiveDate: optionalTextSchema(),
        individual: z.number().nullable().optional(),
        parentChild: z.number().nullable().optional(),
        parentChildren: z.number().nullable().optional(),
        husbandWife: z.number().nullable().optional(),
        family: z.number().nullable().optional(),
      }),
    )
    .optional(),
})

export const employerPlanEditSchema = employerSchema.extend({
  name: optionalTextSchema(),
  parentCompanyId: optionalTextSchema(),
  address1: optionalTextSchema(),
  city: optionalTextSchema(),
  zip: optionalTextSchema(),
  contactFirst: optionalTextSchema(),
  contactLast: optionalTextSchema(),
  groupNumber: optionalTextSchema(),
})

export type EmployerFormValues = z.infer<typeof employerSchema>
export type PlanRateFormItem = NonNullable<EmployerFormValues['planRates']>[number]

