import { isAxiosError } from 'axios'

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  // 1. Check Axios response data if error is an Axios error
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as {
      title?: string
      message?: string
      detail?: string
      error?: string
    }

    if (typeof data.title === 'string' && data.title.trim()) {
      return data.title.trim()
    }
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message.trim()
    }
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail.trim()
    }
    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error.trim()
    }
  }

  // 2. Check standard Error / ApiError message
  if (error instanceof Error && error.message.trim()) {
    const msg = error.message.trim()
    // Ignore generic Axios status messages like "Request failed with status code 409" if a fallback is provided
    if (
      !msg.startsWith('Request failed') &&
      !msg.startsWith('AxiosError') &&
      !msg.startsWith('Network Error')
    ) {
      return msg
    }
    // If msg has specific detail from getApiError, return it
    if (msg.length > 0) {
      return msg
    }
  }

  return fallbackMessage
}
