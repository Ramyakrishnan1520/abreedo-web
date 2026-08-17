import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteCoverageCodeApi } from '#/api/coverage-code/coverage-code.api.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

export function useDeleteCoverageCode() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteCoverageCodeApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['coverage-codes'] })
      queryClient.invalidateQueries({ queryKey: ['coverage-codes', id] })
      toast.success(COVERAGE_CODE_CONTENT.toasts.deleteSuccess)
    },
    onError: (error) => {
      console.error('Failed to delete coverage code:', error)
      const message = getApiErrorMessage(
        error,
        COVERAGE_CODE_CONTENT.toasts.deleteError,
      )
      toast.error(message)
    },
  })
}
