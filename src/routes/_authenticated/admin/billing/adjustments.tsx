import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/billing/adjustments',
)({
  component: BillingAdjustmentsPage,
})

function BillingAdjustmentsPage() {
  return <RoutePlaceholderPage title="Adjustments" section="Billing" />
}
