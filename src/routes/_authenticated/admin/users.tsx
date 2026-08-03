import { createFileRoute } from '@tanstack/react-router'

import { UsersPage } from '#/pages/users.tsx'

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: UsersPage,
})
