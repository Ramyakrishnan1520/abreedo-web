import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/life-insurance')({
  component: LifeInsurancePage,
})

function LifeInsurancePage() {
  return <RoutePlaceholderPage title="Life Insurance" section="Site Manager" />
}
