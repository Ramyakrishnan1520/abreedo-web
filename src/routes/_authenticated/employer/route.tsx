import { createFileRoute, redirect } from '@tanstack/react-router'

import { EmployerLayout } from '#/components/layout/EmployerLayout.tsx'
import { getRoleHome } from '#/utils/getRoleHome.ts'
import { UserRole } from '#/enums/user-role.ts'
import { ROUTES } from '#/static/routes.ts'

export const Route = createFileRoute('/_authenticated/employer')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getState().user

    if (!user) {
      throw redirect({ to: ROUTES.LOGIN })
    }

    if (user.role !== UserRole.Employer) {
      throw redirect({ to: getRoleHome(user.role) })
    }
  },
  component: EmployerLayout,
})
