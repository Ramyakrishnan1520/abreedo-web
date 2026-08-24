import { createFileRoute } from '@tanstack/react-router'

import { EmployerSelectionPage } from '#/pages/employer/employer/selection.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employers/employer/selection',
)({
  component: EmployerSelectionPage,
})
