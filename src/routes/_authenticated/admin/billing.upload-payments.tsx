import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/billing/upload-payments',
)({
  component: UploadPaymentsPage,
})

function UploadPaymentsPage() {
  return <RoutePlaceholderPage title="Upload Payments" section="Billing" />
}
