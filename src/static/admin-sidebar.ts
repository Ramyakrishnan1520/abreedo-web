import { ROUTES } from '#/static/routes.ts'
import type { SidebarSection } from '#/types/navigation.ts'

export const adminSidebar: SidebarSection[] = [
  {
    id: 'site-manager',
    title: 'Site Manager',
    items: [
      {
        id: 'users',
        title: 'Users',
        route: ROUTES.ADMIN_USERS,
      },
      {
        id: 'carriers',
        title: 'Carriers',
        route: ROUTES.ADMIN_CARRIERS,
      },
      {
        id: 'coverage-codes',
        title: 'Coverage Codes',
        route: ROUTES.ADMIN_COVERAGE_CODES,
      },
      {
        id: 'parent-companies',
        title: 'Parent Companies',
        route: ROUTES.ADMIN_PARENT_COMPANIES,
      },
      {
        id: 'termination-codes',
        title: 'Termination Codes',
        route: ROUTES.ADMIN_TERMINATION_CODES,
      },
      {
        id: 'employers',
        title: 'Employers',
        route: ROUTES.ADMIN_EMPLOYERS,
      },
      {
        id: 'plans',
        title: 'Plans',
        route: ROUTES.ADMIN_PLANS,
      },
      {
        id: 'member-search',
        title: 'Member Search',
        route: ROUTES.ADMIN_MEMBER_SEARCH,
      },
      {
        id: 'life-insurance',
        title: 'Life Insurance',
        route: ROUTES.ADMIN_LIFE_INSURANCE,
      },
    ],
  },
  {
    id: 'employer',
    title: 'Employer',
    items: [
      {
        id: 'employer-groups',
        title: 'Employer Groups',
        route: ROUTES.ADMIN_EMPLOYER_GROUPS,
      },
      {
        id: 'cobra-notification',
        title: 'Cobra Notification',
        route: ROUTES.ADMIN_COBRA_NOTIFICATION,
      },
    ],
  },
  {
    id: 'open-enrollment',
    title: 'Open Enrollment',
    items: [
      {
        id: 'pending-requests',
        title: 'Pending Requests',
        route: ROUTES.ADMIN_ENROLLMENT_PENDING_REQUESTS,
      },
    ],
  },
  {
    id: 'employer-group',
    title: 'Employer Group',
    items: [
      {
        id: 'members-list',
        title: 'Members List',
        route: ROUTES.ADMIN_EMPLOYER_GROUP_MEMBERS,
      },
      {
        id: 'employee-type-list',
        title: 'Employee Type List',
        route: ROUTES.ADMIN_EMPLOYER_GROUP_EMPLOYEE_TYPES,
      },
      {
        id: 'employer-group-member-search',
        title: 'Member Search',
        route: ROUTES.ADMIN_EMPLOYER_GROUP_MEMBER_SEARCH,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    items: [
      {
        id: 'payments',
        title: 'Payments',
        route: ROUTES.ADMIN_BILLING_PAYMENTS,
      },
      {
        id: 'billing-adjustments',
        title: 'Adjustments',
        route: ROUTES.ADMIN_BILLING_ADJUSTMENTS,
      },
      {
        id: 'invoices',
        title: 'Invoices',
        route: ROUTES.ADMIN_BILLING_INVOICES,
      },
      {
        id: 'upload-payments',
        title: 'Upload Payments',
        route: ROUTES.ADMIN_BILLING_UPLOAD_PAYMENTS,
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    items: [
      {
        id: 'reports',
        title: 'Reports',
        route: ROUTES.ADMIN_REPORTS,
      },
    ],
  },
]
