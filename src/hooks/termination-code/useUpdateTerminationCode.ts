import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateTerminationCodeApi } from '#/api/termination-code/termination-code.api.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { CreateTerminationCodeRequest } from '#/types/termination-code.ts'

interface UpdateTerminationCodeVariables {
  id: string
  data: CreateTerminationCodeRequest
}

export function useUpdateTerminationCode() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateTerminationCodeVariables>({
    mutationFn: ({ id, data }) => updateTerminationCodeApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['termination-codes'] })
      queryClient.invalidateQueries({ queryKey: ['termination-codes', id] })
      toast.success(TERMINATION_CODE_CONTENT.toasts.updateSuccess)
    },
    onError: (error) => {
      console.error('Failed to update termination code:', error)
      const message = getApiErrorMessage(
        error,
        TERMINATION_CODE_CONTENT.toasts.updateError,
      )
      toast.error(message)
    },
  })
}
