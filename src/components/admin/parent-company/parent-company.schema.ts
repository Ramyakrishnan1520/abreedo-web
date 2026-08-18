import { z } from 'zod'

import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'

const { validation: messages } = PARENT_COMPANY_CONTENT

const optionalTenDigitPhoneSchema = (digitsMessage: string) =>
  z
    .string()
    .trim()
    .refine((val) => !val || /^\d{10}$/.test(val), digitsMessage)

const optionalFiveDigitZipSchema = z
  .string()
  .trim()
  .refine((val) => !val || /^\d{5}$/.test(val), messages.zipDigits)

const optionalEmailSchema = z
  .string()
  .trim()
  .refine(
    (val) => !val || z.string().email().safeParse(val).success,
    messages.emailInvalid,
  )

export const contactSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  phoneNumber: optionalTenDigitPhoneSchema(messages.contactPhoneDigits),
  alternativePhoneNumber: optionalTenDigitPhoneSchema(
    messages.alternativePhoneDigits,
  ),
  fax: optionalTenDigitPhoneSchema(messages.faxDigits),
  email: optionalEmailSchema,
  website: z.string().trim(),
})

export const parentCompanySchema = z.object({
  name: z.string().min(1, 'Parent Company Name is required').trim(),
  fullName: z.string().trim(),
  address1: z.string().trim(),
  address2: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  zipCode: optionalFiveDigitZipSchema,
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
  notes: z.string().trim(),
  allowCobra: z.boolean(),
})

export type ParentCompanySchemaValues = z.infer<typeof parentCompanySchema>
