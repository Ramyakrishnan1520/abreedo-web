import { createFileRoute } from '@tanstack/react-router'

import { EmployerSelectionPage } from '#/pages/employer/selection.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/')({
  component: EmployerSelectionPage,
})
