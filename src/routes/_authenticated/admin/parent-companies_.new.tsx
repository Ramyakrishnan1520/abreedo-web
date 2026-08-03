import { createFileRoute } from '@tanstack/react-router'

import { NewParentCompanyPage } from '#/pages/parent-company/parent-companies.new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-companies_/new',
)({
  component: NewParentCompanyPage,
})
