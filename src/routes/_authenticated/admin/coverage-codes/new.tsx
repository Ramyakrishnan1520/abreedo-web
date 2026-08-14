import { createFileRoute } from '@tanstack/react-router'

import { NewCoverageCodePage } from '#/pages/coverage-codes/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/coverage-codes/new',
)({
  component: NewCoverageCodePage,
})
