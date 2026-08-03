import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createCoverageCodeApi } from '#/api/coverage-code/coverage-code.api.ts'

import type {
  CoverageCodeUpsertRequest,
  CoverageCodeDtoPagedResult,
} from '#/types/coverage-code.ts'

export function useCreateCoverageCode() {
  const queryClient = useQueryClient()

  return useMutation<
    CoverageCodeDtoPagedResult,
    Error,
    CoverageCodeUpsertRequest
  >({
    mutationFn: createCoverageCodeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverage-codes'] })
      toast.success('Coverage code created successfully!')
    },
    onError: (error) => {
      console.error('Failed to create coverage code:', error.message)
      toast.error('Failed to create coverage code. Please try again.')
    },
  })
}
