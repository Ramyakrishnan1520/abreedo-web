import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/employer/reports/billing')({
  component: EmployeeBillingReportPage,
})

function EmployeeBillingReportPage() {
  return <RoutePlaceholderPage title="Billing Report" section="Reports" />
}
