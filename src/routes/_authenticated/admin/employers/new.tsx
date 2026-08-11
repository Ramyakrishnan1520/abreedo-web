import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/new')({
  component: NewEmployerPage,
})

function NewEmployerPage() {
  return <RoutePlaceholderPage title="New Employer Setup" section="Administration" />
}
