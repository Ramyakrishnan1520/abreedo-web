import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/reports/eligibility')({
  component: EligibilityReportPage,
})

function EligibilityReportPage() {
  return <RoutePlaceholderPage title="Eligibility Report" section="Reports" />
}
