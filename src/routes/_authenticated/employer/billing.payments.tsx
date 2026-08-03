import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/employer/billing/payments')({
  component: EmployeeBillingPaymentsPage,
})

function EmployeeBillingPaymentsPage() {
  return <RoutePlaceholderPage title="Payments" section="Billing" />
}
