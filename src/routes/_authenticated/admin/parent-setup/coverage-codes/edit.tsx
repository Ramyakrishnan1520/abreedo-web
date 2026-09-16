import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { EditCoverageCodePage } from '#/pages/parent-setup/coverage-code/edit.tsx'

export const coverageCodeEditSearchSchema = z.object({
  coverageCodeId: z.string().optional(),
  mode: z.enum(['table', 'view', 'edit']).catch('table').optional().default('table'),
})

export type CoverageCodeEditSearch = z.infer<typeof coverageCodeEditSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/coverage-codes/edit',
)({
  validateSearch: (search: Record<string, unknown>): CoverageCodeEditSearch =>
    coverageCodeEditSearchSchema.parse(search),
  component: EditCoverageCodePage,
})

