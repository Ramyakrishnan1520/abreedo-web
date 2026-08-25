import { createFileRoute } from '@tanstack/react-router'

import { NewCoverageCodePage } from '#/pages/parent-setup/coverage-code/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/parent-setup/coverage-codes/new',
)({
  component: NewCoverageCodePage,
})
