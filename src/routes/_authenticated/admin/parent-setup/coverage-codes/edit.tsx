import { createFileRoute } from '@tanstack/react-router'

import { EditCoverageCodePage } from '#/pages/parent-setup/coverage-code/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/coverage-codes/edit',
)({
  component: EditCoverageCodePage,
})
