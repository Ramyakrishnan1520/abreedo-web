import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/employer/employer-groups/benefits',
)({
  component: EmployeeGroupBenefitsPage,
})

function EmployeeGroupBenefitsPage() {
  return <RoutePlaceholderPage title="Benefits" section="Employer Group" />
}
