import { createFileRoute } from '@tanstack/react-router'

import { EditCarrierPage } from '#/pages/carrier/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/carriers/edit',
)({
  component: EditCarrierPage,
})
