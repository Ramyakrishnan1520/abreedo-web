import { createFileRoute } from '@tanstack/react-router'

import { PlanSelectionPage } from '#/pages/parent-setup/plans/selection.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/plans/',
)({
  component: PlanSelectionPage,
})
