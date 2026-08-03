import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/billing/payments')({
  component: BillingPaymentsPage,
})

function BillingPaymentsPage() {
  return <RoutePlaceholderPage title="Payments" section="Billing" />
}
