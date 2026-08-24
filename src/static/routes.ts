export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  ADMIN_ROOT: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_MEMBER_SEARCH: '/admin/member-search',
  ADMIN_MEMBERS_NEW: '/admin/members/new',
  ADMIN_MEMBERS_EDIT: '/admin/members/edit',
  ADMIN_MEMBERS_TERMINATE: '/admin/members/terminate',
  ADMIN_COBRA_NOTIFICATION: '/admin/cobra-notification',

  // Administration -> Parent Setup Domain
  ADMIN_PARENT_SETUP: '/admin/parent-setup',

  // 1. Parent Company Setup
  ADMIN_PARENT_COMPANIES: '/admin/parent-setup/parent-company',
  ADMIN_PARENT_COMPANIES_NEW: '/admin/parent-setup/parent-company/new',
  ADMIN_PARENT_COMPANIES_EDIT: '/admin/parent-setup/parent-company/edit',

  // 2. Carriers & Coverage Code Setup
  ADMIN_CARRIER: '/admin/parent-setup/carriers',
  ADMIN_CARRIERS: '/admin/parent-setup/carriers',
  ADMIN_CARRIERS_NEW: '/admin/parent-setup/carriers/new',
  ADMIN_CARRIERS_EDIT: '/admin/parent-setup/carriers/edit',
  ADMIN_COVERAGE_CODES: '/admin/parent-setup/carriers',
  ADMIN_COVERAGE_CODES_NEW: '/admin/parent-setup/coverage-codes/new',
  ADMIN_COVERAGE_CODES_EDIT: '/admin/parent-setup/coverage-codes/edit',

  // 3. Termination Codes Setup
  ADMIN_TERMINATION_CODES: '/admin/parent-setup/termination-codes',
  ADMIN_TERMINATION_CODES_NEW: '/admin/parent-setup/termination-codes/new',
  ADMIN_TERMINATION_CODES_EDIT: '/admin/parent-setup/termination-codes/edit',

  // 4. Plans Setup
  ADMIN_PLANS: '/admin/parent-setup/plans',
  ADMIN_PLANS_NEW: '/admin/parent-setup/plans/new',

  // Employers Flow
  ADMIN_EMPLOYERS: '/admin/employers',
  ADMIN_EMPLOYERS_SETUP: '/admin/employers/employer',
  ADMIN_EMPLOYERS_USERS: '/admin/employers/users',
  ADMIN_EMPLOYERS_MANAGE: '/admin/employers/employer/selection',
  ADMIN_EMPLOYERS_GROUPS: '/admin/employers/employer-groups',
  ADMIN_EMPLOYERS_NEW: '/admin/employers/employer/new',
  ADMIN_EMPLOYERS_EDIT: '/admin/employers/employer/edit',
  ADMIN_ENROLLMENT_EVENTS: '/admin/open-enrollment/events',
  ADMIN_ENROLLMENT_SETUP: '/admin/open-enrollment/setup',
  ADMIN_ENROLLMENT_REVIEW: '/admin/open-enrollment/review',
  ADMIN_ENROLLMENT_PENDING_REQUESTS:
    '/admin/open-enrollment/pending-requests',
  ADMIN_EMPLOYER_GROUPS: '/admin/employer-groups',
  ADMIN_EMPLOYER_GROUP_MEMBERS: '/admin/employer-groups/members',
  ADMIN_EMPLOYER_GROUP_BENEFITS: '/admin/employer-groups/benefits',
  ADMIN_EMPLOYER_GROUP_EMPLOYEE_TYPES:
    '/admin/employer-groups/employee-types',
  ADMIN_EMPLOYER_GROUP_MEMBER_SEARCH:
    '/admin/employer-groups/member-search',
  ADMIN_BILLING_INVOICES: '/admin/billing/invoices',
  ADMIN_BILLING_PAYMENTS: '/admin/billing/payments',
  ADMIN_BILLING_ADJUSTMENTS: '/admin/billing/adjustments',
  ADMIN_BILLING_UPLOAD_PAYMENTS: '/admin/billing/upload-payments',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_REPORTS_ELIGIBILITY: '/admin/reports/eligibility',
  ADMIN_REPORTS_BILLING: '/admin/reports/billing',
  ADMIN_REPORTS_ENROLLMENT: '/admin/reports/enrollment',

  EMPLOYEE_ROOT: '/employer',
  EMPLOYEE_GROUP_MEMBERS: '/employer/employer-groups/members',
  EMPLOYEE_GROUP_BENEFITS: '/employer/employer-groups/benefits',
  EMPLOYEE_BILLING_INVOICES: '/employer/billing/invoices',
  EMPLOYEE_BILLING_PAYMENTS: '/employer/billing/payments',
  EMPLOYEE_BILLING_PAYMENT_METHODS: '/employer/billing/payment-methods',
  EMPLOYEE_REPORTS_ELIGIBILITY: '/employer/reports/eligibility',
  EMPLOYEE_REPORTS_BILLING: '/employer/reports/billing',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
