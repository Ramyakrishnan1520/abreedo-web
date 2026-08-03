import { useCallback } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'

import { useAuth } from '#/hooks/auth/useAuth.ts'
import { useInactivityTimeout } from '#/hooks/auth/useInactivityTimeout.ts'

export function AuthenticatedLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleInactivityTimeout = useCallback(() => {
    logout()
    void navigate({ to: '/login' })
  }, [logout, navigate])

  useInactivityTimeout({
    onTimeout: handleInactivityTimeout,
  })

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
