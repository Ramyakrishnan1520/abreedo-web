import { apiClient } from '#/api/api-client.ts'
import { refreshAccessToken } from './auth-refresh.api.ts'

import type {
  AuthTokenResponse,
  LoginRequest,
  MeResponse,
  RefreshRequest,
} from '#/types/auth.ts'

export async function loginApi(data: LoginRequest): Promise<AuthTokenResponse> {
  const response = await apiClient.post<AuthTokenResponse>(
    '/api/v1/auth/login',
    data,
  )

  return response.data
}

export async function refreshApi(data: RefreshRequest): Promise<AuthTokenResponse> {
  return refreshAccessToken(data.refreshToken)
}

export async function getMeApi(accessToken: string): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>('/api/v1/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}
