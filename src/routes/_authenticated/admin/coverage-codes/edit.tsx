import { createFileRoute } from '@tanstack/react-router'

import { EditCoverageCodePage } from '#/pages/coverage-codes/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/coverage-codes/edit',
)({
  component: EditCoverageCodePage,
})
