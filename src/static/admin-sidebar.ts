import { BarChart3, CalendarDays, FileText, Settings, Users } from 'lucide-react'
import { ROUTES } from '#/static/routes.ts'
import type { SidebarSection } from '#/types/navigation.ts'

export const adminSidebar: SidebarSection[] = [
  {
    id: 'members',
    title: 'Members',
    icon: Users,
    items: [
      {
        id: 'lookup-member',
        title: 'Look Up Member',
        route: ROUTES.ADMIN_MEMBER_LOOKUP,
      },
      {
        id: 'add-new-member',
        title: 'Add New Member',
        route: ROUTES.ADMIN_MEMBERS_NEW,
      },
      {
        id: 'edit-member',
        title: 'Edit Member',
        route: ROUTES.ADMIN_MEMBERS_EDIT,
      },
      {
        id: 'terminate-member',
        title: 'Terminate',
        route: ROUTES.ADMIN_MEMBERS_TERMINATE,
      },
      {
        id: 'member-types',
        title: 'Member Types',
        route: ROUTES.ADMIN_EMPLOYER_GROUP_EMPLOYEE_TYPES,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: FileText,
    items: [
      {
        id: 'billing-payments',
        title: 'Payments',
        route: ROUTES.ADMIN_BILLING_PAYMENTS,
      },
      {
        id: 'billing-adjustments',
        title: 'Adjustments',
        route: ROUTES.ADMIN_BILLING_ADJUSTMENTS,
      },
      {
        id: 'billing-invoices',
        title: 'Invoices',
        route: ROUTES.ADMIN_BILLING_INVOICES,
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: BarChart3,
    items: [
      {
        id: 'run-reports',
        title: 'Run Reports',
        route: ROUTES.ADMIN_REPORTS,
      },
      {
        id: 'saved-reports',
        title: 'Saved Reports',
        route: ROUTES.ADMIN_REPORTS_ELIGIBILITY,
      },
    ],
  },
  {
    id: 'administration',
    title: 'Administration',
    icon: Settings,
    items: [
      {
        id: 'admin-member-search',
        title: 'Member Search',
        route: ROUTES.ADMIN_MEMBER_SEARCH,
      },
      {
        id: 'admin-parent-setup',
        title: 'Parent Setup',
        route: ROUTES.ADMIN_PARENT_SETUP,
      },
      {
        id: 'admin-employer-setup',
        title: 'Employer Setup',
        route: ROUTES.ADMIN_EMPLOYERS_SETUP,
      },
      {
        id: 'admin-cobra-notifications',
        title: 'Cobra Notifications',
        route: ROUTES.ADMIN_COBRA_NOTIFICATION,
      },
    ],
  },
  {
    id: 'open-enrollment',
    title: 'Open Enrollment',
    icon: CalendarDays,
    route: ROUTES.ADMIN_ENROLLMENT_PENDING_REQUESTS,
    items: [],
  },
]

