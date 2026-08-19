import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteEmployerApi } from '#/api/employer/employer.api.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

export function useDeleteEmployer() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteEmployerApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] })
      toast.success(EMPLOYER_CONTENT.toasts.deleteSuccess)
    },
    onError: (error) => {
      console.error('Failed to delete employer:', error)
      const message = getApiErrorMessage(
        error,
        EMPLOYER_CONTENT.toasts.deleteError,
      )
      toast.error(message)
    },
  })
}
