import { createFileRoute } from '@tanstack/react-router'

import { NewCarrierPage } from '#/pages/parent-setup/carrier/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/carriers/new',
)({
  component: NewCarrierPage,
})
