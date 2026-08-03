import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/layout/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/contacts')({
  component: EmployerContactsPage,
})

function EmployerContactsPage() {
  return <RoutePlaceholderPage title="Employer Contacts" section="Employer" />
}
