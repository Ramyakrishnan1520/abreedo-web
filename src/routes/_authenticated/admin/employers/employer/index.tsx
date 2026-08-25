import { createFileRoute } from '@tanstack/react-router'

import { EmployerSetupTaskPage } from '#/pages/employer/employer/index.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employers/employer/',
)({
  component: EmployerSetupTaskPage,
})
