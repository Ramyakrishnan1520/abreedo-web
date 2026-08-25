import { createFileRoute } from '@tanstack/react-router'

import { NewEmployerPage } from '#/pages/employer/employer/new.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employers/employer/new',
)({
  component: NewEmployerPage,
})
