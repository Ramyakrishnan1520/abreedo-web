import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers')({
  component: EmployersPage,
})

function EmployersPage() {
  return <RoutePlaceholderPage title="Employers" section="Site Manager" />
}
