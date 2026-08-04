import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/reports/billing')({
  component: BillingReportPage,
})

function BillingReportPage() {
  return <RoutePlaceholderPage title="Billing Report" section="Reports" />
}
