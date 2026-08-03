import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { loginApi, getMeApi } from '#/api/auth/auth.api.ts'
import { createApiError, isApiError } from '#/api/api-client.ts'
import { useAuth, getRoleHome } from '#/features/auth/auth.tsx'

import type { LoginRequest } from '#/api/auth/auth.types.ts'
import type { UserRole } from '#/features/auth/auth.tsx'

function mapUserRole(userRole: string): UserRole {
  const normalized = userRole.trim().toLowerCase()
  if (normalized === 'administrator') return 'admin'
  return 'employer'
}

export function useLogin() {
  const { login, setTokens } = useAuth()
  const navigate = useNavigate()

  return useMutation<void, Error, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      const tokens = await loginApi(credentials)

      setTokens(tokens)

      // Fetch user profile from the /me API
      const profile = await getMeApi(tokens.accessToken)

      login({
        id: profile.userAccessId,
        name: profile.login,
        email: `${profile.login}@abreedo.local`,
        role: mapUserRole(profile.role),
      })

      await navigate({ to: getRoleHome(mapUserRole(profile.role)) })
    },

    onError: (err) => {
      if (isApiError(err) && err.status === 401) {
        throw createApiError(
          401,
          'Invalid username or password. Please check your credentials.',
        )
      }
    },
  })
}
