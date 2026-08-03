import { createFileRoute, redirect } from '@tanstack/react-router'

import { EmployerLayout } from '#/components/layouts/EmployerLayout.tsx'
import { getRoleHome } from '#/features/auth/auth.tsx'
import { ROUTES } from '#/static/routes.ts'

export const Route = createFileRoute('/_authenticated/employer')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getState().user

    if (!user) {
      throw redirect({ to: ROUTES.LOGIN })
    }

    if (user.role !== 'employer') {
      throw redirect({ to: getRoleHome(user.role) })
    }
  },
  component: EmployerLayout,
})
