import { createFileRoute } from '@tanstack/react-router'

import { NewEmployerPage } from '#/pages/employer/new.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/new')({
  component: NewEmployerPage,
})
