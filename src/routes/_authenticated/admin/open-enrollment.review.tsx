import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/open-enrollment/review',
)({
  component: EnrollmentReviewPage,
})

function EnrollmentReviewPage() {
  return (
    <RoutePlaceholderPage title="Enrollment Review" section="Open Enrollment" />
  )
}
