import { createFileRoute } from '@tanstack/react-router'
import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/members/lookup')({
  component: LookupMemberPage,
})

function LookupMemberPage() {
  return (
    <main className="page-wrap py-8">
      <RoutePlaceholderPage title="Lookup Member" section="Members" />
    </main>
  )
}
