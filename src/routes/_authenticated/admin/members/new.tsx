import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/members/new')({
  component: AddNewMemberPage,
})

function AddNewMemberPage() {
  return (
    <main className="page-wrap py-8">
      <RoutePlaceholderPage title="Add New Member" section="Members" />
    </main>
  )
}
