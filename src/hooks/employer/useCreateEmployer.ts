import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createEmployerApi } from '#/api/employer/employer.api.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerApiItem, EmployerUpsertRequest } from '#/types/employer.ts'

export function useCreateEmployer() {
  const queryClient = useQueryClient()

  return useMutation<EmployerApiItem, Error, EmployerUpsertRequest>({
    mutationFn: createEmployerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] })
      toast.success(EMPLOYER_CONTENT.toasts.createSuccess)
    },
    onError: () => {
      toast.error(EMPLOYER_CONTENT.toasts.createError)
    },
  })
}
