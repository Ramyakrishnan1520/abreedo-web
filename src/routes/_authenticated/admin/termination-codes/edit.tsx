import { createFileRoute } from '@tanstack/react-router'

import { EditTerminationCodePage } from '#/pages/termination-code/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/termination-codes/edit',
)({
  component: EditTerminationCodePage,
})
