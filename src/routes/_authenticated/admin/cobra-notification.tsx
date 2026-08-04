import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'

export const Route = createFileRoute('/_authenticated/admin/cobra-notification')({
  component: CobraNotificationPage,
})

function CobraNotificationPage() {
  return <RoutePlaceholderPage title="Cobra Notification" section="Employer" />
}
