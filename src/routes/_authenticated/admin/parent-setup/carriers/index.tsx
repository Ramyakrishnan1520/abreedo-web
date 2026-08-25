import { createFileRoute } from '@tanstack/react-router'

import { CarrierSelectionPage } from '#/pages/parent-setup/carrier/selection.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/carriers/',
)({
  component: CarrierSelectionPage,
})
