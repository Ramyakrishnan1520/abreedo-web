import { createFileRoute } from '@tanstack/react-router'

import { NewPlanPage } from '#/pages/plans/new.tsx'

export const Route = createFileRoute('/_authenticated/admin/plan/new')({
  component: NewPlanPage,
})
