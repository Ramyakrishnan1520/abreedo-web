import { Outlet, useNavigate } from '@tanstack/react-router'

import { Header } from '#/components/Header.tsx'
import { Sidebar } from '#/components/Sidebar.tsx'
import { useAuth } from '#/hooks/auth/useAuth.ts'
import { ROUTES } from '#/static/routes.ts'
import type { NavigationRoleInput } from '#/types/navigation.ts'

interface LayoutProps {
  role: NavigationRoleInput
  companyName?: string
}

export function Layout({ role, companyName = 'ABREEDO Benefits' }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    void navigate({ to: ROUTES.LOGIN })
  }

  return (
    <div className="min-h-screen">
      <Header
        userName={user?.name ?? 'User'}
        companyName={companyName}
        role={role}
      />

      <div className="mx-auto grid w-full grid-cols-1 md:grid-cols-[18rem_minmax(0,1fr)]">
        <Sidebar
          role={role}
          onLogout={handleLogout}
          className="max-h-[calc(100vh-5rem)] md:sticky md:top-[5rem]"
        />

        <div className="min-w-0 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
