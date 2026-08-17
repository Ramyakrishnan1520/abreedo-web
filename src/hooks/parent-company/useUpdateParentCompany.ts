import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateParentCompanyApi } from '#/api/parent-company/parent-company.api.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { mapParentCompanyFormToRequest } from '#/utils/mapParentCompanyFormToRequest.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

interface UpdateParentCompanyVariables {
  id: string
  values: ParentCompanyFormValues
}

export function useUpdateParentCompany() {
  return useMutation<void, Error, UpdateParentCompanyVariables>({
    mutationFn: async ({ id, values }) => {
      const payload = mapParentCompanyFormToRequest(values)
      await updateParentCompanyApi(id, payload)
    },
    onSuccess: () => {
      toast.success(PARENT_COMPANY_CONTENT.toasts.update.success)
    },
    onError: (error) => {
      console.error('Failed to update parent company:', error)
      const message = getApiErrorMessage(
        error,
        PARENT_COMPANY_CONTENT.toasts.update.error,
      )
      toast.error(message)
    },
  })
}
