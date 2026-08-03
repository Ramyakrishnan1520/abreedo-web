import type { ReactNode } from 'react'

import { ROUTES } from '#/static/routes.ts'
import { useAuthStore } from '#/stores/auth-store.ts'
import type { UserRole } from '#/stores/auth-store.ts'

export type { AuthUser, LoginInput, UserRole } from '#/stores/auth-store.ts'
export type AuthStore = typeof useAuthStore

export function getRoleHome(role: UserRole) {
  return role === 'admin' ? ROUTES.ADMIN_USERS : ROUTES.EMPLOYEE_ROOT
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useAuth() {
  const { user, login, setTokens, logout } = useAuthStore()

  return {
    user,
    isAuthenticated: Boolean(user),
    login,
    setTokens,
    logout,
  }
}
