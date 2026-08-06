import { createFileRoute } from '@tanstack/react-router'

import { PlansPage } from '#/pages/plans/index.tsx'

export const Route = createFileRoute('/_authenticated/admin/plan/')({
  component: PlansPage,
})
