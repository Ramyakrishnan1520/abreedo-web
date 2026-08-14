import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteTerminationCodeApi } from '#/api/termination-code/termination-code.api.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

export function useDeleteTerminationCode() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteTerminationCodeApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['termination-codes'] })
      queryClient.invalidateQueries({ queryKey: ['termination-codes', id] })
      toast.success(TERMINATION_CODE_CONTENT.toasts.deleteSuccess)
    },
    onError: (error) => {
      console.error('Failed to delete termination code:', error)
      const message = getApiErrorMessage(
        error,
        TERMINATION_CODE_CONTENT.toasts.deleteError,
      )
      toast.error(message)
    },
  })
}
