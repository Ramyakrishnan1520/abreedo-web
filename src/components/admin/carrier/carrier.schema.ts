import { z } from 'zod'

import {
  LETTERS_ONLY_REGEX,
  optionalEmailSchema,
  optionalPhoneSchema,
  optionalTextSchema,
  optionalZipSchema,
  requiredTextSchema,
} from '#/components/admin/common/form-field-schemas.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'

const { validation: v } = CARRIER_CONTENT

export const carrierSchema = z.object({
  name: requiredTextSchema(v.nameRequired, { max: 100, maxMessage: v.nameMax }),
  groupTitle: requiredTextSchema(v.groupTitleRequired, {
    max: 100,
    maxMessage: v.groupTitleMax,
  }),
  address1: optionalTextSchema({ max: 200, maxMessage: v.addressMax }),
  address2: optionalTextSchema({ max: 200, maxMessage: v.addressMax }),
  city: optionalTextSchema({
    max: 100,
    maxMessage: v.cityMax,
    pattern: LETTERS_ONLY_REGEX,
    patternMessage: v.cityLetters,
  }),
  state: optionalTextSchema(),
  zip: optionalZipSchema(v.zipInvalid),
  contactFirstName: optionalTextSchema({
    max: 50,
    maxMessage: v.firstNameMax,
    pattern: LETTERS_ONLY_REGEX,
    patternMessage: v.firstNameLetters,
  }),
  contactLastName: optionalTextSchema({
    max: 50,
    maxMessage: v.lastNameMax,
    pattern: LETTERS_ONLY_REGEX,
    patternMessage: v.lastNameLetters,
  }),
  phone: optionalPhoneSchema(v.phoneInvalid),
  fax: optionalPhoneSchema(v.faxInvalid),
  email: optionalEmailSchema(v.emailInvalid, {
    max: 254,
    maxMessage: v.emailMax,
  }),
  allowFlexibleDates: z.boolean().optional(),
})

export type CarrierFormValues = z.infer<typeof carrierSchema>
