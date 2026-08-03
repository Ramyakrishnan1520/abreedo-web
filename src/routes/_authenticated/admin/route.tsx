import { createFileRoute, redirect } from '@tanstack/react-router'

import { AdminLayout } from '#/components/layout/AdminLayout.tsx'
import { getRoleHome } from '#/utils/getRoleHome.ts'
import { UserRole } from '#/enums/user-role.ts'
import { ROUTES } from '#/static/routes.ts'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getState().user

    if (!user) {
      throw redirect({ to: ROUTES.LOGIN })
    }

    if (user.role !== UserRole.Admin) {
      throw redirect({ to: getRoleHome(user.role) })
    }
  },
  component: AdminLayout,
})
