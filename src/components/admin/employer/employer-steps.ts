import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

export const EMPLOYER_STEPS = EMPLOYER_CONTENT.form.steps

export const EMPLOYER_DEFAULT_VALUES: EmployerFormValues = {
  name: '',
  parentCompanyId: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',

  contactFirst: '',
  contactLast: '',
  contactTitle: '',
  phone: '',
  fax: '',
  email: '',

  carrierIds: [],
  linkedCarriers: [],

  groupNumber: '',
  policyNumber: '',
  tpacNumber: '',
  monthlyAdminFee: undefined,
  status: 1,
  isPaper: false,
  allowCobra: false,
  isPano: false,
  renewalDate: '',
  initialNotificationStartOn: '',

  notesTitle: '',
  notes: '',
}
