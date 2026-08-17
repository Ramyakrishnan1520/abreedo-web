import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createTerminationCodeApi } from '#/api/termination-code/termination-code.api.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { CreateTerminationCodeRequest } from '#/types/termination-code.ts'

export function useCreateTerminationCode() {
  const queryClient = useQueryClient()

  return useMutation<{ id: string }, Error, CreateTerminationCodeRequest>({
    mutationFn: (data) => createTerminationCodeApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['termination-codes'] })
      toast.success(TERMINATION_CODE_CONTENT.toasts.createSuccess)
    },
    onError: (error) => {
      console.error('Failed to create termination code:', error)
      const message = getApiErrorMessage(
        error,
        TERMINATION_CODE_CONTENT.toasts.createError,
      )
      toast.error(message)
    },
  })
}
