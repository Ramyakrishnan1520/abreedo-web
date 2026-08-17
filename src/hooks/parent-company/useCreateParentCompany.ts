import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createParentCompanyApi } from '#/api/parent-company/parent-company.api.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { mapParentCompanyFormToRequest } from '#/utils/mapParentCompanyFormToRequest.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

import type { CreateParentCompanyResponse, ParentCompanyFormValues } from '#/types/parent-company.ts'

export function useCreateParentCompany() {
  return useMutation<
    CreateParentCompanyResponse,
    Error,
    ParentCompanyFormValues
  >({
    mutationFn: async (values) => {
      const payload = mapParentCompanyFormToRequest(values)
      return createParentCompanyApi(payload)
    },
    onSuccess: () => {
      toast.success(PARENT_COMPANY_CONTENT.toasts.create.success)
    },
    onError: (error) => {
      console.error('Failed to create parent company:', error)
      const message = getApiErrorMessage(
        error,
        PARENT_COMPANY_CONTENT.toasts.create.error,
      )
      toast.error(message)
    },
  })
}
