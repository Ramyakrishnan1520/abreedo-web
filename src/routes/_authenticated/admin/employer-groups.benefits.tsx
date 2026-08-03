import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employer-groups/benefits',
)({
  component: GroupBenefitsPage,
})

function GroupBenefitsPage() {
  return (
    <RoutePlaceholderPage title="Group Benefits" section="Employer Group" />
  )
}
