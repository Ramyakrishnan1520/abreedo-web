import type { ParentCompanyStep } from '#/types/parent-company.ts'

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

export const PARENT_COMPANY_STEPS: ParentCompanyStep[] = [
  { id: 'general', label: 'General', index: 0 },
  { id: 'contact', label: 'Contact', index: 1 },
  { id: 'carriers', label: 'Carriers', index: 2 },
  { id: 'notes', label: 'Notes', index: 3 },
  { id: 'review', label: 'Review', index: 4 },
]
