import { Outlet, useRouteContext } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from '#/features/auth/auth.tsx'
import { Toaster } from '#/components/ui/sonner.tsx'

export function RootRouteComponent() {
  const { queryClient } = useRouteContext({ from: '__root__' })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
