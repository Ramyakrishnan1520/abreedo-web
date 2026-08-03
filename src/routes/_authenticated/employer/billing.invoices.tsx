import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/employer/billing/invoices')({
  component: EmployeeBillingInvoicesPage,
})

function EmployeeBillingInvoicesPage() {
  return <RoutePlaceholderPage title="Invoices" section="Billing" />
}
