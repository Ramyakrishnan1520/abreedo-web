import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employer-groups/members',
)({
  component: GroupMembersPage,
})

function GroupMembersPage() {
  return <RoutePlaceholderPage title="Members List" section="Employer Group" />
}
