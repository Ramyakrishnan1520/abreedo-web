import { useAuthStore } from '#/stores/auth-store.ts'

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
