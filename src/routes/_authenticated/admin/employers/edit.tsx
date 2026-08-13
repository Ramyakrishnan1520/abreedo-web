import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/edit')({
  component: EditEmployerPage,
})

function EditEmployerPage() {
  return <RoutePlaceholderPage title="Employer Edit" section="Administration" />
}
