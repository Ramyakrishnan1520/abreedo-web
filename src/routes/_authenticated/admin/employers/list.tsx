import { createFileRoute } from '@tanstack/react-router'

import { EmployersListPage } from '#/pages/employer/list.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/list')({
  component: EmployersListPage,
})
