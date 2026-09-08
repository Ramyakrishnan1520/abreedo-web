import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateEmployerPlanApi } from '#/api/employer/employer.api.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

import type { EmployerPlanUpdateRequest } from '#/types/employer.ts'

export function useUpdateEmployerPlan() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    { id: string; data: EmployerPlanUpdateRequest }
  >({
    mutationFn: ({ id, data }) => updateEmployerPlanApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] })
      toast.success(EMPLOYER_CONTENT.toasts.updatePlanSuccess)
    },
    onError: (error) => {
      console.error('Failed to update employer plan:', error)
      const message = getApiErrorMessage(
        error,
        EMPLOYER_CONTENT.toasts.updatePlanError,
      )
      toast.error(message)
    },
  })
}
