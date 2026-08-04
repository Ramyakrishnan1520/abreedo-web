import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { loginApi, getMeApi } from '#/api/auth/auth.api.ts'
import { createApiError, isApiError } from '#/api/api-client.ts'
import { LOGIN_CONTENT } from '#/utils/login-content.ts'
import { useAuth } from '#/hooks/auth/useAuth.ts'
import { getRoleHome } from '#/utils/getRoleHome.ts'

import { UserRole } from '#/enums/user-role.ts'

import type { LoginRequest } from '#/types/auth.ts'

function mapUserRole(userRole: string): UserRole {
  const normalized = userRole.trim().toLowerCase()
  if (normalized === 'administrator') return UserRole.Admin
  return UserRole.Employer
}

export function useLogin() {
  const { login, setTokens } = useAuth()
  const navigate = useNavigate()

  return useMutation<void, Error, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      const tokens = await loginApi(credentials)

      setTokens(tokens)

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
        throw createApiError(401, LOGIN_CONTENT.errors.invalidCredentials)
      }
    },
  })
}
