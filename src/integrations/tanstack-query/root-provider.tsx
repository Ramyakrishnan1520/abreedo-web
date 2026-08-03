import { QueryClient } from '@tanstack/react-query'

import { useAuthStore } from '#/stores/auth-store.ts'

export function getContext() {
  const queryClient = new QueryClient()

  return {
    auth: useAuthStore,
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
