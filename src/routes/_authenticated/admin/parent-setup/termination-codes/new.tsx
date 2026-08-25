import { createFileRoute } from '@tanstack/react-router'

import { NewTerminationCodePage } from '#/pages/parent-setup/termination-code/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/termination-codes/new',
)({
  component: NewTerminationCodePage,
})
