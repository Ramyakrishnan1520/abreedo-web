import { createFileRoute, redirect } from '@tanstack/react-router'

import { UnauthenticatedLayout } from '#/components/layouts/UnauthenticatedLayout.tsx'
import { getRoleHome } from '#/features/auth/auth.tsx'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getState().user

    if (user) {
      throw redirect({ to: getRoleHome(user.role) })
    }
  },
  component: UnauthenticatedLayout,
})
