import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deletePlanApi } from '#/api/plan/plan.api.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

export function useDeletePlan() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deletePlanApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success(PLAN_CONTENT.toasts.deleteSuccess)
    },
    onError: (error) => {
      console.error('Failed to delete plan:', error)
      const message = getApiErrorMessage(
        error,
        PLAN_CONTENT.toasts.deleteError,
      )
      toast.error(message)
    },
  })
}
