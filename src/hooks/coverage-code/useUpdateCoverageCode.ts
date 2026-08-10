import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateCoverageCodeApi } from '#/api/coverage-code/coverage-code.api.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'

import type { CoverageCodeUpsertRequest } from '#/types/coverage-code.ts'

interface UpdateCoverageCodeVariables {
  id: string
  data: CoverageCodeUpsertRequest
}

export function useUpdateCoverageCode() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateCoverageCodeVariables>({
    mutationFn: ({ id, data }) => updateCoverageCodeApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['coverage-codes'] })
      queryClient.invalidateQueries({ queryKey: ['coverage-codes', id] })
      toast.success(COVERAGE_CODE_CONTENT.toasts.updateSuccess)
    },
    onError: (error) => {
      console.error('Failed to update coverage code:', error.message)
      toast.error(COVERAGE_CODE_CONTENT.toasts.updateError)
    },
  })
}
