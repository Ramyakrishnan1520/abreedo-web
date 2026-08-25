import { createFileRoute } from '@tanstack/react-router'

import { ParentCompaniesPage } from '#/pages/parent-setup/parent-company/selection.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/parent-company/',
)({
  component: ParentCompaniesPage,
})
