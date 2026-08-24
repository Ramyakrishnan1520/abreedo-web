import { createFileRoute } from '@tanstack/react-router'

import { PlansPage } from '#/pages/parent-setup/plans/index.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/plans/',
)({
  component: PlansPage,
})
