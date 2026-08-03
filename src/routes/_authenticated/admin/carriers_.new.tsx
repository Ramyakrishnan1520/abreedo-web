import { createFileRoute } from '@tanstack/react-router'

import { NewCarrierPage } from '#/pages/carrier/carriers.new.tsx'

export const Route = createFileRoute('/_authenticated/admin/carriers_/new')({
  component: NewCarrierPage,
})
