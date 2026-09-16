import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { EditEmployerPage } from '#/pages/employer/employer/edit.tsx'

export const employerEditSearchSchema = z.object({
  employerId: z.string().optional(),
  mode: z
    .enum(['table', 'view', 'edit-general', 'plans-list'])
    .catch('table')
    .optional()
    .default('table'),
})

export type EmployerEditSearch = z.infer<typeof employerEditSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/admin/employers/employer/edit',
)({
  validateSearch: (search: Record<string, unknown>): EmployerEditSearch =>
    employerEditSearchSchema.parse(search),
  component: EditEmployerPage,
})

