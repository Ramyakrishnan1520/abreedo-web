import { createFileRoute } from '@tanstack/react-router'

import { EmployerGroupSetupPage } from '#/pages/employer/employer-group/index.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employers/employer-groups/',
)({
  component: EmployerGroupSetupPage,
})
