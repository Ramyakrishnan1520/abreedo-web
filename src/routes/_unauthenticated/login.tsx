import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '#/components/auth/login/login-page.tsx'

export const Route = createFileRoute('/_unauthenticated/login')({
  component: LoginPage,
})
