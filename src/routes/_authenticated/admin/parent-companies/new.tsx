import { createFileRoute } from '@tanstack/react-router'

import { NewParentCompanyPage } from '#/pages/parent-company/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-companies/new',
)({
  component: NewParentCompanyPage,
})
