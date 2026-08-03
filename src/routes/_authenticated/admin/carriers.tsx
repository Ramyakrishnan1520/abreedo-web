import { createFileRoute } from '@tanstack/react-router'

import { CarriersPage } from '#/pages/carrier/carriers'

export const Route = createFileRoute('/_authenticated/admin/carriers')({
  component: CarriersPage,
})
