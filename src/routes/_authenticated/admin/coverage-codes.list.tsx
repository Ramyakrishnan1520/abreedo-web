import { createFileRoute } from '@tanstack/react-router'

import { CoverageCodesPage } from '#/pages/coverage-codes/index.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/coverage-codes/list',
)({
  component: CoverageCodesPage,
})
