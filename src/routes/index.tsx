import { createFileRoute, redirect } from '@tanstack/react-router'

import { getRoleHome } from '#/features/auth/auth.tsx'
import { ROUTES } from '#/static/routes.ts'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getState().user

    throw redirect({ to: user ? getRoleHome(user.role) : ROUTES.LOGIN })
  },
})
