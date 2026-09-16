import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createEmployerPlanApi } from '#/api/employer/employer.api.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

import type { EmployerPlansCreateRequest } from '#/types/employer.ts'

export function useCreateEmployerPlan() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    { id: string; data: EmployerPlansCreateRequest }
  >({
    mutationFn: ({ id, data }) => createEmployerPlanApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carrier-group-numbers'] })
      queryClient.invalidateQueries({ queryKey: ['employer-plans'] })
      queryClient.invalidateQueries({ queryKey: ['employers'] })
      toast.success(EMPLOYER_CONTENT.toasts.createPlanSuccess)
    },
    onError: (error) => {
      console.error('Failed to create employer plan:', error)
      const message = getApiErrorMessage(
        error,
        EMPLOYER_CONTENT.toasts.createPlanError,
      )
      toast.error(message)
    },
  })
}
