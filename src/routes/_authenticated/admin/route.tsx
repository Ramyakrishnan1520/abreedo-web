import { createFileRoute, redirect } from '@tanstack/react-router'

import { AdminLayout } from '#/components/layouts/AdminLayout.tsx'
import { getRoleHome } from '#/features/auth/auth.tsx'
import { ROUTES } from '#/static/routes.ts'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getState().user

    if (!user) {
      throw redirect({ to: ROUTES.LOGIN })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: getRoleHome(user.role) })
    }
  },
  component: AdminLayout,
})
