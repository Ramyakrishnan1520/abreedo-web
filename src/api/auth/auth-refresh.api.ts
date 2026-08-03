import axios from 'axios'

import { API_BASE_URL, API_HEADERS } from '#/api/api-config.ts'

import type { AuthTokenResponse } from '#/types/auth.ts'

const AUTH_REFRESH_PATH = '/api/v1/auth/refresh'

export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthTokenResponse> {
  const response = await axios.post<AuthTokenResponse>(
    `${API_BASE_URL}${AUTH_REFRESH_PATH}`,
    { refreshToken },
    { headers: API_HEADERS },
  )

  return response.data
}
