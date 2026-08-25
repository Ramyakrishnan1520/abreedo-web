import { createFileRoute } from '@tanstack/react-router'

import { UsersSetupPage } from '#/pages/employer/users/index.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/users/')({
  component: UsersSetupPage,
})
