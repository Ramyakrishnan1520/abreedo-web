import { createFileRoute } from '@tanstack/react-router'

import { EmployerAndUsersPage } from '#/pages/employer/index.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/')({
  component: EmployerAndUsersPage,
})
