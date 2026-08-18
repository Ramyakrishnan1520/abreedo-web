import { createFileRoute } from '@tanstack/react-router'

import { EditEmployerPage } from '#/pages/employer/edit.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/edit')({
  component: EditEmployerPage,
})
