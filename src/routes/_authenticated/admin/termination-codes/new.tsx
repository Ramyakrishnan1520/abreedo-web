import { createFileRoute } from '@tanstack/react-router'

import { NewTerminationCodePage } from '#/pages/termination-code/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/termination-codes/new',
)({
  component: NewTerminationCodePage,
})
