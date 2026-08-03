import { createFileRoute, redirect } from '@tanstack/react-router'

import { UnauthenticatedLayout } from '#/components/layout/UnauthenticatedLayout.tsx'
import { getRoleHome } from '#/utils/getRoleHome.ts'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context }) => {
    const user = context.auth.getState().user

    if (user) {
      throw redirect({ to: getRoleHome(user.role) })
    }
  },
  component: UnauthenticatedLayout,
})
