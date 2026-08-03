import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/open-enrollment/pending-requests',
)({
  component: PendingRequestsPage,
})

function PendingRequestsPage() {
  return (
    <RoutePlaceholderPage title="Pending Requests" section="Open Enrollment" />
  )
}
