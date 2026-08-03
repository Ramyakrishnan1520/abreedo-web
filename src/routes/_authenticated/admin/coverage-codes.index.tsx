import { createFileRoute } from '@tanstack/react-router'

import { CoverageCodesPage } from '#/pages/coverage-codes/coverage-codes.tsx'

export const Route = createFileRoute('/_authenticated/admin/coverage-codes/')({
  component: CoverageCodesPage,
})

