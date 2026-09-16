import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { EditCarrierPage } from '#/pages/parent-setup/carrier/edit.tsx'

export const carrierEditSearchSchema = z.object({
  carrierId: z.string().optional(),
  mode: z.enum(['table', 'view', 'edit']).catch('table').optional().default('table'),
})

export type CarrierEditSearch = z.infer<typeof carrierEditSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/carriers/edit',
)({
  validateSearch: (search: Record<string, unknown>): CarrierEditSearch =>
    carrierEditSearchSchema.parse(search),
  component: EditCarrierPage,
})

