import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/employer-groups')({
  component: EmployerGroupsPage,
})

function EmployerGroupsPage() {
  return <RoutePlaceholderPage title="Employer Groups" section="Employer" />
}
