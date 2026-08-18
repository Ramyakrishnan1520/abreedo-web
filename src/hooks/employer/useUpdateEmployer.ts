import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateEmployerApi } from '#/api/employer/employer.api.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

import type { EmployerUpsertRequest } from '#/types/employer.ts'

export function useUpdateEmployer() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; data: EmployerUpsertRequest }>({
    mutationFn: ({ id, data }) => updateEmployerApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] })
      toast.success(EMPLOYER_CONTENT.toasts.updateSuccess)
    },
    onError: (error) => {
      console.error('Failed to update employer:', error)
      const message = getApiErrorMessage(
        error,
        EMPLOYER_CONTENT.toasts.updateError,
      )
      toast.error(message)
    },
  })
}
