import { Outlet, useNavigate } from '@tanstack/react-router'

import { Header } from '#/components/Header.tsx'
import { Sidebar } from '#/components/Sidebar.tsx'
import { AdminBreadcrumb } from '#/components/admin/common/AdminBreadcrumb.tsx'
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
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <Header
        userName={user?.name ?? 'User'}
        companyName={companyName}
        role={role}
        className="shrink-0"
      />

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <Sidebar
          role={role}
          onLogout={handleLogout}
          className="w-72 shrink-0 h-full min-h-0"
        />

        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <AdminBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
