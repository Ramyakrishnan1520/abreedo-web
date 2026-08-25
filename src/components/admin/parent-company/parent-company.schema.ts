import { z } from 'zod'

import {
  optionalEmailSchema,
  optionalFiveDigitZipSchema,
  optionalNotesSchema,
  optionalTenDigitPhoneSchema,
  optionalTextSchema,
  requiredTextSchema,
} from '#/components/admin/common/form-field-schemas.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'

const { validation: messages } = PARENT_COMPANY_CONTENT

export const contactSchema = z.object({
  firstName: optionalTextSchema(),
  lastName: optionalTextSchema(),
  phoneNumber: optionalTenDigitPhoneSchema(messages.contactPhoneDigits),
  alternativePhoneNumber: optionalTenDigitPhoneSchema(
    messages.alternativePhoneDigits,
  ),
  fax: optionalTenDigitPhoneSchema(messages.faxDigits),
  email: optionalEmailSchema(messages.emailInvalid),
  website: optionalTextSchema(),
})

export const parentCompanySchema = z.object({
  name: requiredTextSchema(messages.nameRequired),
  fullName: optionalTextSchema(),
  address1: optionalTextSchema(),
  address2: optionalTextSchema(),
  city: optionalTextSchema(),
  state: optionalTextSchema(),
  zipCode: optionalFiveDigitZipSchema(messages.zipDigits),
  contact: contactSchema,
  carrierIds: z
    .array(z.string())
    .refine(
      (ids) => new Set(ids).size === ids.length,
      messages.duplicateCarriers,
    ),
  linkedCarriers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
  notes: optionalNotesSchema(),
  allowCobra: z.boolean(),
})

export type ParentCompanySchemaValues = z.infer<typeof parentCompanySchema>
