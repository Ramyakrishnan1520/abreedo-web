import { z } from 'zod'

import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'

const { validation: v } = CARRIER_CONTENT

const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/

export const carrierSchema = z.object({
  name: z.string().min(1, v.nameRequired).max(100, v.nameMax).trim(),
  groupTitle: z
    .string()
    .min(1, v.groupTitleRequired)
    .max(100, v.groupTitleMax)
    .trim(),
  address1: z.string().max(200, v.addressMax).optional().or(z.literal('')),
  address2: z.string().max(200, v.addressMax).optional().or(z.literal('')),
  city: z
    .string()
    .max(100, v.cityMax)
    .regex(/^[a-zA-Z\s\-'.]*$/, v.cityLetters)
    .optional()
    .or(z.literal('')),
  state: z.string().optional(),
  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, v.zipInvalid)
    .optional()
    .or(z.literal('')),
  contactFirstName: z
    .string()
    .max(50, v.firstNameMax)
    .regex(/^[a-zA-Z\s\-'.]*$/, v.firstNameLetters)
    .optional()
    .or(z.literal('')),
  contactLastName: z
    .string()
    .max(50, v.lastNameMax)
    .regex(/^[a-zA-Z\s\-'.]*$/, v.lastNameLetters)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(phoneRegex, v.phoneInvalid)
    .optional()
    .or(z.literal('')),
  fax: z.string().regex(phoneRegex, v.faxInvalid).optional().or(z.literal('')),
  email: z
    .string()
    .email(v.emailInvalid)
    .max(254, v.emailMax)
    .optional()
    .or(z.literal('')),
})

export type CarrierFormValues = z.infer<typeof carrierSchema>
