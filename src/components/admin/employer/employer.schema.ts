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

export const planRateItemSchema = z.object({
  id: z.string().optional(),
  planRateId: z.string().optional(),
  effectiveDate: requiredTextSchema(v.effectiveDateRequired),
  individual: z.number({ message: v.individualRequired }),
  parentChild: z.number({ message: v.parentChildRequired }),
  parentChildren: z.number({ message: v.parentChildrenRequired }),
  husbandWife: z.number({ message: v.memberSpouseRequired }),
  family: z.number({ message: v.familyRequired }),
})

export const employerGeneralSchema = z.object({
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
    max: 10,
    maxMessage: v.groupNumberMax,
  }),
  policyNumber: optionalTextSchema({
    max: 50,
    maxMessage: v.policyNumberMax,
  }),
  tpacNumber: optionalTextSchema({
    max: 3,
    maxMessage: v.tpacNumberMax,
  }),
  monthlyAdminFee: z
    .number()
    .int()
    .nonnegative()
    .max(9999999999999999, v.monthlyAdminFeeMax)
    .optional(),
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
  notes: optionalNotesSchema({ max: 2000, maxMessage: v.notesMax }),
})

export const configuredEmployerPlanSchema = z.object({
  id: z.string().optional(),
  planId: requiredTextSchema(v.planRequired),
  planName: optionalTextSchema(),
  cgnGroupNumber: requiredTextSchema(v.cgnGroupNumberRequired, {
    max: 100,
  }),
  billerAccountNumber: requiredTextSchema(v.billerAccountNumberRequired, {
    max: 100,
  }),
  cgnCustomerNumber: optionalTextSchema({
    max: 10,
    maxMessage: v.cgnCustomerNumberMax,
  }),
  brokerCodeId: optionalTextSchema(),
  brokerCodeName: optionalTextSchema(),
  isActive: z.boolean().optional(),
  rates: z.array(planRateItemSchema).default([]),
})

export type ConfiguredEmployerPlan = z.infer<typeof configuredEmployerPlanSchema>

export const employerMultiPlanSchema = z.object({
  plans: z
    .array(configuredEmployerPlanSchema)
    .min(1, v.planRequiresAtLeastOne)
    .refine((plans) => plans.every((p) => p.rates && p.rates.length > 0), {
      message: v.rateRequiresAtLeastOne,
    }),
  planId: optionalTextSchema(),
  planName: optionalTextSchema(),
  cgnGroupNumber: optionalTextSchema(),
  billerAccountNumber: optionalTextSchema(),
  cgnCustomerNumber: optionalTextSchema(),
  brokerCodeId: optionalTextSchema(),
  brokerCodeName: optionalTextSchema(),
  isActive: z.boolean().optional(),
  planRates: z.array(planRateItemSchema).optional(),
  existingPlanIds: z.array(z.string()).optional(),
})

export const employerSinglePlanEditSchema = z.object({
  planId: requiredTextSchema(v.planRequired),
  planName: optionalTextSchema(),
  cgnGroupNumber: requiredTextSchema(v.cgnGroupNumberRequired, {
    max: 100,
  }),
  billerAccountNumber: requiredTextSchema(v.billerAccountNumberRequired, {
    max: 100,
  }),
  cgnCustomerNumber: optionalTextSchema({
    max: 10,
    maxMessage: v.cgnCustomerNumberMax,
  }),
  brokerCodeId: optionalTextSchema(),
  brokerCodeName: optionalTextSchema(),
  isActive: z.boolean().optional(),
  planRates: z.array(planRateItemSchema).min(1, v.rateRequiresAtLeastOne),
  plans: z.array(configuredEmployerPlanSchema).optional(),
  existingPlanIds: z.array(z.string()).optional(),
})

export const employerPlanSchema = employerMultiPlanSchema
export const employerAddPlanSchema = employerMultiPlanSchema
export const employerPlanEditSchema = employerSinglePlanEditSchema

export const employerCreateSchema = employerGeneralSchema.merge(employerMultiPlanSchema)

// Aliases for backward compatibility and mode-specific resolvers
export const employerSchema = employerCreateSchema
export const employerGeneralEditSchema = employerGeneralSchema

export type EmployerGeneralSchemaValues = z.infer<typeof employerGeneralSchema>
export type EmployerPlanSchemaValues = z.infer<typeof employerPlanSchema>
export type EmployerFormValues = z.infer<typeof employerCreateSchema>
export type PlanRateFormItem = z.infer<typeof planRateItemSchema>

