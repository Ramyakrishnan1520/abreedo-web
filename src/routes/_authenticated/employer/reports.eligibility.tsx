import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/employer/reports/eligibility',
)({
  component: EmployeeEligibilityReportPage,
})

function EmployeeEligibilityReportPage() {
  return <RoutePlaceholderPage title="Eligibility Report" section="Reports" />
}
