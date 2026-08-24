import { createFileRoute } from '@tanstack/react-router'

import { TerminationCodeSelectionPage } from '#/pages/parent-setup/termination-code/selection.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/termination-codes/',
)({
  component: TerminationCodeSelectionPage,
})
