import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/open-enrollment/events',
)({
  component: EnrollmentEventsPage,
})

function EnrollmentEventsPage() {
  return (
    <RoutePlaceholderPage
      title="Enrollment Events"
      section="Open Enrollment"
    />
  )
}
