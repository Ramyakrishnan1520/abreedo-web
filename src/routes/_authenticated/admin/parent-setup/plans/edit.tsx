import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { EditPlanPage } from '#/pages/parent-setup/plans/edit.tsx'

export const planEditSearchSchema = z.object({
  planId: z.string().optional(),
  mode: z.enum(['table', 'view', 'edit']).catch('table').optional().default('table'),
})

export type PlanEditSearch = z.infer<typeof planEditSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/plans/edit',
)({
  validateSearch: (search: Record<string, unknown>): PlanEditSearch =>
    planEditSearchSchema.parse(search),
  component: EditPlanPage,
})

