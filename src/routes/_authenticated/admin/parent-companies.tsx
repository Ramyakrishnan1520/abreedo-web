import { createFileRoute } from '@tanstack/react-router'

import { ParentCompaniesPage } from '#/pages/parent-company/parent-companies.tsx'

export const Route = createFileRoute('/_authenticated/admin/parent-companies')({
  component: ParentCompaniesPage,
})
