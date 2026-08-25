import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updatePlanApi } from '#/api/plan/plan.api.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

import type { CreatePlanRequest } from '#/types/plan.ts'

interface UpdatePlanVariables {
  id: string
  data: CreatePlanRequest
}

export function useUpdatePlan() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdatePlanVariables>({
    mutationFn: ({ id, data }) => updatePlanApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success(PLAN_CONTENT.toasts.updateSuccess)
    },
    onError: (error) => {
      console.error('Failed to update plan:', error)
      const message = getApiErrorMessage(
        error,
        PLAN_CONTENT.toasts.updateError,
      )
      toast.error(message)
    },
  })
}
