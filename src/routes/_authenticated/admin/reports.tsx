import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  return <RoutePlaceholderPage title="Reports" section="Reports" />
}
