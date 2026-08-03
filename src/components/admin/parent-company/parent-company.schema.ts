import { z } from 'zod'

import { PARENT_COMPANY_CONTENT } from '#/content/admin/parent-company-content.ts'

const { validation: messages } = PARENT_COMPANY_CONTENT

const tenDigitPhoneSchema = (requiredMessage: string, digitsMessage: string) =>
  z
    .string()
    .min(1, requiredMessage)
    .trim()
    .refine((value) => /^\d{10}$/.test(value), digitsMessage)

const fiveDigitZipSchema = z
  .string()
  .min(1, messages.zipRequired)
  .trim()
  .refine((value) => /^\d{5}$/.test(value), messages.zipDigits)

export const contactSchema = z.object({
  firstName: z.string().min(1, messages.contactFirstNameRequired).trim(),
  lastName: z.string().min(1, messages.contactLastNameRequired).trim(),
  phoneNumber: tenDigitPhoneSchema(
    messages.contactPhoneRequired,
    messages.contactPhoneDigits,
  ),
  alternativePhoneNumber: tenDigitPhoneSchema(
    messages.alternativePhoneRequired,
    messages.alternativePhoneDigits,
  ),
  fax: tenDigitPhoneSchema(messages.faxRequired, messages.faxDigits),
  email: z
    .string()
    .min(1, messages.emailRequired)
    .email(messages.emailInvalid)
    .trim(),
  website: z.string().trim(),
})

export const parentCompanySchema = z.object({
  name: z.string().min(1, 'Parent Company Name is required').trim(),
  fullName: z.string().min(1, 'Full Name is required').trim(),
  address1: z.string().min(1, 'Address 1 is required').trim(),
  address2: z.string().min(1, 'Address 2 is required').trim(),
  city: z.string().min(1, 'City is required').trim(),
  state: z.string().min(1, 'State is required').trim(),
  zipCode: fiveDigitZipSchema,
  contact: contactSchema,
  carrierIds: z
    .array(z.string())
    .refine(
      (ids) => new Set(ids).size === ids.length,
      messages.duplicateCarriers,
    ),
  notes: z.string().trim(),
  allowCobra: z.boolean(),
})

export type ParentCompanySchemaValues = z.infer<typeof parentCompanySchema>
