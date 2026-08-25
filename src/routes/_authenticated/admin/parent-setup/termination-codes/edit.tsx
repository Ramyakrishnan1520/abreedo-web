import { createFileRoute } from '@tanstack/react-router'

import { EditTerminationCodePage } from '#/pages/parent-setup/termination-code/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/termination-codes/edit',
)({
  component: EditTerminationCodePage,
})
