import { createFileRoute } from '@tanstack/react-router'

import { TerminationCodeSelectionPage } from '#/pages/termination-code/selection.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/termination-codes/',
)({
  component: TerminationCodeSelectionPage,
})
