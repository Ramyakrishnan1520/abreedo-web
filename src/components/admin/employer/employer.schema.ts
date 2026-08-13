import { z } from 'zod'

const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/

export const employerSchema = z.object({
  // General Step
  name: z.string().min(1, 'Employer Name is required').max(100),
  parentCompanyId: z.string().min(1, 'Parent Company is required'),
  address1: z.string().min(1, 'Address 1 is required').max(200),
  address2: z.string().max(200).optional().or(z.literal('')),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100)
    .regex(/^[a-zA-Z\s\-'.]*$/, 'City must contain only letters'),
  state: z.string().optional().or(z.literal('')),
  zip: z
    .string()
    .min(1, 'ZIP Code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code (e.g. 12345 or 12345-6789)'),

  // Contact Step
  contactFirst: z
    .string()
    .min(1, 'Contact First Name is required')
    .max(50)
    .regex(/^[a-zA-Z\s\-'.]*$/, 'First name must contain only letters'),
  contactLast: z
    .string()
    .min(1, 'Contact Last Name is required')
    .max(50)
    .regex(/^[a-zA-Z\s\-'.]*$/, 'Last name must contain only letters'),
  contactTitle: z.string().max(100).optional().or(z.literal('')),
  phone: z
    .string()
    .regex(phoneRegex, 'Enter a valid phone number — (___) ___-____')
    .optional()
    .or(z.literal('')),
  fax: z
    .string()
    .regex(phoneRegex, 'Enter a valid fax number — (___) ___-____')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Enter a valid email address')
    .max(254)
    .optional()
    .or(z.literal('')),

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
  groupNumber: z.string().min(1, 'Group Number is required').max(100),
  policyNumber: z.string().max(100).optional().or(z.literal('')),
  tpacNumber: z.string().max(100).optional().or(z.literal('')),
  monthlyAdminFee: z.number().int().nonnegative().optional(),
  status: z.number().optional(),
  isPaper: z.boolean().optional(),
  allowCobra: z.boolean().optional(),
  isPano: z.boolean().optional(),
  renewalDate: z.string().optional().or(z.literal('')),
  initialNotificationStartOn: z.string().optional().or(z.literal('')),

  // Notes Step
  notesTitle: z.string().max(200).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export type EmployerFormValues = z.infer<typeof employerSchema>
