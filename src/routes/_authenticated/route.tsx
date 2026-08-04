import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthenticatedLayout } from '#/components/layout/AuthenticatedLayout.tsx'
import { ROUTES } from '#/static/routes.ts'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.getState().user) {
      throw redirect({ to: ROUTES.LOGIN })
    }
  },
  component: AuthenticatedLayout,
})
