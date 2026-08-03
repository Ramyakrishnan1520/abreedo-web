import { PARENT_COMPANY_CONTENT } from '#/content/admin/parent-company-content.ts'

export const PARENT_COMPANY_DEFAULT_VALUES = {
  name: '',
  fullName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipCode: '',
  contact: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    alternativePhoneNumber: '',
    fax: '',
    email: '',
    website: '',
  },
  carrierIds: [] as string[],
  notes: '',
  allowCobra: false,
}

export const PARENT_COMPANY_STEPS = PARENT_COMPANY_CONTENT.form.steps
