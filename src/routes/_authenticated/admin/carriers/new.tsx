import { createFileRoute } from '@tanstack/react-router'

import { NewCarrierPage } from '#/pages/carrier/new.tsx'

export const Route = createFileRoute('/_authenticated/admin/carriers/new')({
  component: NewCarrierPage,
})
