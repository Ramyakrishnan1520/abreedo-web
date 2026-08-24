import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/members/terminate')({
  component: TerminateMemberPage,
})

function TerminateMemberPage() {
  return (
    <main className="page-wrap py-8">
      <RoutePlaceholderPage title="Terminate Member" section="Members" />
    </main>
  )
}
