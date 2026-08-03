import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employer-groups/employee-types',
)({
  component: EmployeeTypeListPage,
})

function EmployeeTypeListPage() {
  return (
    <RoutePlaceholderPage title="Employee Type List" section="Employer Group" />
  )
}
