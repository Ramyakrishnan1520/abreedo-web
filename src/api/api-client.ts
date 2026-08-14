import axios, { AxiosHeaders, isAxiosError } from 'axios'

import { API_BASE_URL, API_HEADERS } from '#/api/api-config.ts'
import { refreshAccessToken } from '#/api/auth/auth-refresh.api.ts'
import { useAuthStore } from '#/stores/auth-store.ts'
import type { ApiError, RetryRequestConfig } from '#/types/api-client.ts'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: API_HEADERS,
})

export function createApiError(status: number, message: string): ApiError {
  const error = new Error(message) as ApiError
  error.name = 'ApiError'
  error.status = status
  return error
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    error.name === 'ApiError' &&
    'status' in error &&
    typeof error.status === 'number'
  )
}

function getApiError(error: unknown): ApiError {
  if (!isAxiosError(error)) {
    return createApiError(0, 'Request failed')
  }

  const status = error.response?.status ?? 0
  const data = error.response?.data
  let message = error.message

  if (typeof data === 'string' && data.trim()) {
    message = data.trim()
  } else if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.title === 'string' && obj.title.trim()) {
      message = obj.title.trim()
    } else if (typeof obj.message === 'string' && obj.message.trim()) {
      message = obj.message.trim()
    } else if (typeof obj.detail === 'string' && obj.detail.trim()) {
      message = obj.detail.trim()
    } else if (typeof obj.error === 'string' && obj.error.trim()) {
      message = obj.error.trim()
    }
  }

  return createApiError(status, message)
}

apiClient.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState()
  
  if (tokens?.accessToken) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${tokens.accessToken}`)
    config.headers = headers
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(getApiError(error))
    }

    const originalRequest = error.config as RetryRequestConfig | undefined
    const { tokens, setTokens, logout } = useAuthStore.getState()

    if (
      error.response?.status === 401 &&
      tokens?.refreshToken &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const data = await refreshAccessToken(tokens.refreshToken)

        setTokens(data)

        const headers = AxiosHeaders.from(originalRequest.headers)
        headers.set('Authorization', `Bearer ${data.accessToken}`)
        originalRequest.headers = headers

        return apiClient(originalRequest)
      } catch (refreshError) {
        const refreshStatus = isAxiosError(refreshError)
          ? refreshError.response?.status
          : undefined

        if (refreshStatus === 401 || refreshStatus === 403) {
          logout()
          return Promise.reject(
            createApiError(401, 'Session expired. Please log in again.'),
          )
        }

        return Promise.reject(getApiError(refreshError))
      }
    }

    return Promise.reject(getApiError(error))
  },
)
