import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/plans')({
  component: PlansPage,
})

function PlansPage() {
  return <RoutePlaceholderPage title="Plans" section="Site Manager" />
}
