import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/employer/billing/payment-methods',
)({
  component: EmployeePaymentMethodsPage,
})

function EmployeePaymentMethodsPage() {
  return <RoutePlaceholderPage title="Payment Methods" section="Billing" />
}
