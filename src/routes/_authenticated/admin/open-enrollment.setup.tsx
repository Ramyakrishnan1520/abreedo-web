import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/open-enrollment/setup',
)({
  component: EnrollmentSetupPage,
})

function EnrollmentSetupPage() {
  return (
    <RoutePlaceholderPage title="Enrollment Setup" section="Open Enrollment" />
  )
}
