import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createPlanApi } from '#/api/plan/plan.api.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import type { CreatePlanRequest, CreatePlanResponse } from '#/types/plan.ts'

export function useCreatePlan() {
  const queryClient = useQueryClient()

  return useMutation<CreatePlanResponse, Error, CreatePlanRequest>({
    mutationFn: (data: CreatePlanRequest) => createPlanApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      toast.success(PLAN_CONTENT.toasts.createSuccess)
    },
    onError: (error) => {
      console.error('Failed to create plan:', error.message)
      toast.error(PLAN_CONTENT.toasts.createError)
    },
  })
}
