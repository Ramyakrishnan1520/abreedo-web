import { createFileRoute } from '@tanstack/react-router'

import { NewParentCompanyPage } from '#/pages/parent-setup/parent-company/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/parent-company/new',
)({
  component: NewParentCompanyPage,
})
