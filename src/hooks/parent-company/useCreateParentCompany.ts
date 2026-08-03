import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createParentCompanyApi } from '#/api/parent-company/parent-company.api.ts'
import { mapParentCompanyFormToRequest } from '#/utils/parent-company/mapParentCompanyFormToRequest.ts'

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
      toast.success('Parent Company created successfully.')
    },
    onError: (error) => {
      console.error('Failed to create parent company:', error.message)
      toast.error('Failed to create parent company. Please try again.')
    },
  })
}
