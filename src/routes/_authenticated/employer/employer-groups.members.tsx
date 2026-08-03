import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/employer/employer-groups/members',
)({
  component: EmployeeGroupMembersPage,
})

function EmployeeGroupMembersPage() {
  return <RoutePlaceholderPage title="Members" section="Employer Group" />
}
