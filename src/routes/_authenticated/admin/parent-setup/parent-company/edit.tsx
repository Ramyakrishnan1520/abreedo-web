import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { EditParentCompanyPage } from '#/pages/parent-setup/parent-company/edit.tsx'

export const parentCompanyEditSearchSchema = z.object({
  parentCompanyId: z.string().optional(),
  mode: z.enum(['table', 'view', 'edit']).catch('table').optional().default('table'),
})

export type ParentCompanyEditSearch = z.infer<typeof parentCompanyEditSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/parent-company/edit',
)({
  validateSearch: (search: Record<string, unknown>): ParentCompanyEditSearch =>
    parentCompanyEditSearchSchema.parse(search),
  component: EditParentCompanyPage,
})

