import { createFileRoute } from '@tanstack/react-router'

import { CarrierSelectionPage } from '#/pages/carrier/selection.tsx'

export const Route = createFileRoute('/_authenticated/admin/carriers/')({
  component: CarrierSelectionPage,
})
