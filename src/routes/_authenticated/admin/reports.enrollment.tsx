import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/reports/enrollment')({
  component: EnrollmentReportPage,
})

function EnrollmentReportPage() {
  return <RoutePlaceholderPage title="Enrollment Report" section="Reports" />
}
