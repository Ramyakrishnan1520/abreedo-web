import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTES } from '#/static/routes.ts'

export const Route = createFileRoute('/_authenticated/admin/carrier')({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.ADMIN_CARRIERS })
  },
})
