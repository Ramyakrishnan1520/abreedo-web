import { createFileRoute } from '@tanstack/react-router'

import { CoverageCodeSelectionPage } from '#/pages/coverage-codes/selection.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/coverage-codes/',
)({
  component: CoverageCodeSelectionPage,
})
