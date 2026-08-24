import { createFileRoute } from '@tanstack/react-router'

import { EditEmployerPage } from '#/pages/employer/employer/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/admin/employers/employer/edit',
)({
  component: EditEmployerPage,
})
