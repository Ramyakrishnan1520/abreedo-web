import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employer-groups/member-search',
)({
  component: EmployerGroupMemberSearchPage,
})

function EmployerGroupMemberSearchPage() {
  return <RoutePlaceholderPage title="Member Search" section="Employer Group" />
}
