import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { EditTerminationCodePage } from '#/pages/parent-setup/termination-code/edit.tsx'

export const terminationCodeEditSearchSchema = z.object({
  terminationCodeId: z.string().optional(),
  mode: z.enum(['table', 'view', 'edit']).catch('table').optional().default('table'),
})

export type TerminationCodeEditSearch = z.infer<typeof terminationCodeEditSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/termination-codes/edit',
)({
  validateSearch: (search: Record<string, unknown>): TerminationCodeEditSearch =>
    terminationCodeEditSearchSchema.parse(search),
  component: EditTerminationCodePage,
})

