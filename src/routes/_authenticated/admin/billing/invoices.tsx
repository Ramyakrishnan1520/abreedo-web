import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/billing/invoices')({
  component: BillingInvoicesPage,
})

function BillingInvoicesPage() {
  return <RoutePlaceholderPage title="Invoices" section="Billing" />
}
