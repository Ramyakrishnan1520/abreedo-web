import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteParentCompanyApi } from '#/api/parent-company/parent-company.api.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

export function useDeleteParentCompany() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteParentCompanyApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-companies'] })
      toast.success(PARENT_COMPANY_CONTENT.toasts.delete.success)
    },
    onError: (error) => {
      console.error('Failed to delete parent company:', error)
      const message = getApiErrorMessage(
        error,
        PARENT_COMPANY_CONTENT.toasts.delete.error,
      )
      toast.error(message)
    },
  })
}
