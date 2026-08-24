import { createFileRoute } from '@tanstack/react-router'

import { EditParentCompanyPage } from '#/pages/parent-setup/parent-company/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/parent-company/edit',
)({
  component: EditParentCompanyPage,
})
