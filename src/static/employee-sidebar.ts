import { ROUTES } from '#/static/routes.ts'
import type { SidebarSection } from '#/types/navigation.ts'

export const employeeSidebar: SidebarSection[] = [
  {
    id: 'employer-group',
    title: 'Employer Group',
    items: [
      {
        id: 'members',
        title: 'Members',
        route: ROUTES.EMPLOYEE_GROUP_MEMBERS,
      },
      {
        id: 'benefits',
        title: 'Benefits',
        route: ROUTES.EMPLOYEE_GROUP_BENEFITS,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    items: [
      {
        id: 'invoices',
        title: 'Invoices',
        route: ROUTES.EMPLOYEE_BILLING_INVOICES,
      },
      {
        id: 'payments',
        title: 'Payments',
        route: ROUTES.EMPLOYEE_BILLING_PAYMENTS,
      },
      {
        id: 'payment-methods',
        title: 'Payment Methods',
        route: ROUTES.EMPLOYEE_BILLING_PAYMENT_METHODS,
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    items: [
      {
        id: 'eligibility-report',
        title: 'Eligibility Report',
        route: ROUTES.EMPLOYEE_REPORTS_ELIGIBILITY,
      },
      {
        id: 'billing-report',
        title: 'Billing Report',
        route: ROUTES.EMPLOYEE_REPORTS_BILLING,
      },
    ],
  },
]
