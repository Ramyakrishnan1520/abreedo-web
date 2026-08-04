import { createFileRoute } from '@tanstack/react-router'

import { EditParentCompanyPage } from '#/pages/parent-company/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-companies/edit',
)({
  component: EditParentCompanyPage,
})
