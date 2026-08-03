import { createFileRoute } from '@tanstack/react-router'

import NewCoverageCodePage from '#/pages/coverage-codes/New-coverage-code'

export const Route = createFileRoute(
  '/_authenticated/admin/coverage-codes/new',
)({
  component: NewCoverageCodePage,
})
