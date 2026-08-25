import { createFileRoute } from '@tanstack/react-router'

import { NewPlanPage } from '#/pages/parent-setup/plans/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/plans/new',
)({
  component: NewPlanPage,
})
