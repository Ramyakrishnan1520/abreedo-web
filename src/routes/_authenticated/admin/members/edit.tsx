import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/members/edit')({
  component: EditMemberPage,
})

function EditMemberPage() {
  return (
    <main className="page-wrap py-8">
      <RoutePlaceholderPage title="Edit Member" section="Members" />
    </main>
  )
}
