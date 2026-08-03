import { z } from 'zod'

const tenDigitPhoneSchema = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .trim()
    .refine(
      (value) => /^\d{10}$/.test(value),
      `${label} must be exactly 10 digits`,
    )

const fiveDigitZipSchema = z
  .string()
  .min(1, 'Zip Code is required')
  .trim()
  .refine(
    (value) => /^\d{5}$/.test(value),
    'Zip Code must be exactly 5 digits',
  )

export const contactSchema = z.object({
  firstName: z.string().min(1, 'Contact First Name is required').trim(),
  lastName: z.string().min(1, 'Contact Last Name is required').trim(),
  phoneNumber: tenDigitPhoneSchema('Contact Phone Number'),
  alternativePhoneNumber: tenDigitPhoneSchema('Alternative Phone Number'),
  fax: tenDigitPhoneSchema('Fax'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
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
      'Duplicate carriers are not allowed',
    ),
  notes: z.string().trim(),
  allowCobra: z.boolean(),
})

export type ParentCompanySchemaValues = z.infer<typeof parentCompanySchema>
