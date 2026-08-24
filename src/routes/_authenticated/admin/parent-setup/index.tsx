import { createFileRoute } from '@tanstack/react-router'

import { ParentSetupTasksPage } from '#/pages/parent-setup/index.tsx'

export const Route = createFileRoute('/_authenticated/admin/parent-setup/')({
  component: ParentSetupTasksPage,
})
