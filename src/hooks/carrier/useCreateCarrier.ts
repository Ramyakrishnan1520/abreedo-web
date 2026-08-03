import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createCarrierApi } from '#/api/carrier/carrier.api.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'

import type { CreateCarrierRequest, CreateCarrierResponse } from '#/types/carrier.ts'

export function useCreateCarrier() {
  const queryClient = useQueryClient()

  return useMutation<CreateCarrierResponse, Error, CreateCarrierRequest>({
    mutationFn: createCarrierApi,
    onSuccess: (response) => {
      console.log('Carrier created:', response)
      queryClient.invalidateQueries({ queryKey: ['carriers'] })
      toast.success(CARRIER_CONTENT.toasts.createSuccess)
    },
    onError: (error) => {
      console.error('Failed to create carrier:', error.message)
      toast.error(CARRIER_CONTENT.toasts.createError)
    },
  })
}
