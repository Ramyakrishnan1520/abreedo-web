import { createFileRoute } from '@tanstack/react-router'

import { EditPlanPage } from '#/pages/parent-setup/plans/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/plans/edit',
)({
  component: EditPlanPage,
})
