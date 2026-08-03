import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/employers/plans')({
  component: EmployerPlansPage,
})

function EmployerPlansPage() {
  return <RoutePlaceholderPage title="Employer Plans" section="Employer" />
}
