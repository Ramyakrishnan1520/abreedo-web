import { createFileRoute } from '@tanstack/react-router'

import { EditCarrierPage } from '#/pages/parent-setup/carrier/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/carriers/edit',
)({
  component: EditCarrierPage,
})
