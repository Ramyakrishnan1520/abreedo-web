import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/member-search')({
  component: MemberSearchPage,
})

function MemberSearchPage() {
  return <RoutePlaceholderPage title="Member Search" section="Site Manager" />
}
