import { adminSidebar } from '#/static/admin-sidebar.ts'
import { employeeSidebar } from '#/static/employee-sidebar.ts'
import { ROUTES } from '#/static/routes.ts'
import type { SidebarItem, SidebarSection } from '#/types/navigation.ts'

function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/'
}

function humanizeSegment(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function humanizeRoutePath(path: string): string {
  const segments = normalizePath(path).split('/').filter(Boolean)
  const segment = segments.at(-1)

  return segment ? humanizeSegment(segment) : 'Home'
}

function flattenSidebarItems(items: SidebarItem[]): SidebarItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenSidebarItems(item.children) : []),
  ])
}

function sidebarRouteLabels(sections: SidebarSection[]): Record<string, string> {
  return sections
    .flatMap((section) => flattenSidebarItems(section.items))
    .reduce<Record<string, string>>((labels, item) => {
      if (item.route) {
        labels[normalizePath(item.route)] = item.title
      }
      return labels
    }, {})
}

export const PATH_ALIASES: Record<string, string> = {
  '/admin/parent-setup/coverage-codes': ROUTES.ADMIN_CARRIERS,
}

const ROUTE_LABEL_OVERRIDES: Record<string, string> = {
  [ROUTES.ADMIN_PARENT_SETUP]: 'Administration',
  [ROUTES.ADMIN_PARENT_COMPANIES]: 'Parent Company Setup',
  [ROUTES.ADMIN_PARENT_COMPANIES_NEW]: 'Create New Parent Company',
  [ROUTES.ADMIN_PARENT_COMPANIES_EDIT]: 'Update Current Parent Companies',
  [ROUTES.ADMIN_CARRIERS]: 'Carriers & Coverage Code Setup',
  [ROUTES.ADMIN_CARRIERS_NEW]: 'New Carrier',
  [ROUTES.ADMIN_CARRIERS_EDIT]: 'Update Current Carriers',
  '/admin/parent-setup/coverage-codes': 'Carriers & Coverage Code Setup',
  [ROUTES.ADMIN_COVERAGE_CODES_NEW]: 'New Coverage Code',
  [ROUTES.ADMIN_COVERAGE_CODES_EDIT]: 'Update Current Coverage Codes',
  [ROUTES.ADMIN_TERMINATION_CODES]: 'Termination Code Setup',
  [ROUTES.ADMIN_TERMINATION_CODES_NEW]: 'New Termination Code',
  [ROUTES.ADMIN_TERMINATION_CODES_EDIT]: 'Update Current Termination Codes',
  [ROUTES.ADMIN_PLANS]: 'Plan Setup',
  [ROUTES.ADMIN_PLANS_NEW]: 'New Plan Setup',
  [ROUTES.ADMIN_PLANS_EDIT]: 'Update Current Plans',
  [ROUTES.ADMIN_EMPLOYERS]: 'Administration',
  [ROUTES.ADMIN_EMPLOYERS_SETUP]: 'Administration',
  [ROUTES.ADMIN_EMPLOYERS_USERS]: 'Users',
  [ROUTES.ADMIN_EMPLOYERS_NEW]: 'New Employer',
  [ROUTES.ADMIN_EMPLOYERS_EDIT]: 'Update Current Employer',
  [ROUTES.ADMIN_ENROLLMENT_EVENTS]: 'Events',
  [ROUTES.ADMIN_ENROLLMENT_SETUP]: 'Setup',
  [ROUTES.ADMIN_ENROLLMENT_REVIEW]: 'Review',
  [ROUTES.ADMIN_REPORTS_ELIGIBILITY]: 'Eligibility Report',
  [ROUTES.ADMIN_REPORTS_BILLING]: 'Billing Report',
  [ROUTES.ADMIN_REPORTS_ENROLLMENT]: 'Enrollment Report',
  [ROUTES.ADMIN_EMPLOYER_GROUPS]: 'Employer Group Setup',
  [ROUTES.ADMIN_EMPLOYER_GROUP_MEMBERS]: 'Employer Group Members',
  [ROUTES.ADMIN_EMPLOYER_GROUP_BENEFITS]: 'Benefits',
  [ROUTES.ADMIN_EMPLOYER_GROUP_EMPLOYEE_TYPES]: 'Member Types',
  [ROUTES.ADMIN_EMPLOYER_GROUP_MEMBER_SEARCH]: 'Member Search',
  [ROUTES.EMPLOYEE_REPORTS_ELIGIBILITY]: 'Eligibility Report',
  [ROUTES.EMPLOYEE_REPORTS_BILLING]: 'Billing Report',
}

const PATH_LABELS: Record<string, string> = {
  ...Object.fromEntries(
    Object.values(ROUTES).map((route) => [
      normalizePath(route),
      humanizeRoutePath(route),
    ]),
  ),
  ...sidebarRouteLabels(adminSidebar),
  ...sidebarRouteLabels(employeeSidebar),
  ...Object.fromEntries(
    Object.entries(ROUTE_LABEL_OVERRIDES).map(([route, label]) => [
      normalizePath(route),
      label,
    ]),
  ),
}

export function getBreadcrumbPath(path: string): string {
  const normalized = normalizePath(path)
  return PATH_ALIASES[normalized] ?? normalized
}

export function getBreadcrumbLabel(path: string, segment: string): string {
  const resolvedPath = getBreadcrumbPath(path)
  return (
    PATH_LABELS[resolvedPath] ??
    PATH_LABELS[normalizePath(path)] ??
    humanizeSegment(segment)
  )
}
