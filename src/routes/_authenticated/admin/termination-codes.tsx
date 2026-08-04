import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/termination-codes')({
  component: TerminationCodesPage,
})

function TerminationCodesPage() {
  return (
    <RoutePlaceholderPage title="Termination Codes" section="Site Manager" />
  )
}
