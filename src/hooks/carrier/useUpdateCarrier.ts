import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateCarrierApi } from '#/api/carrier/carrier.api.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { getApiErrorMessage } from '#/utils/getApiErrorMessage.ts'

import type { CreateCarrierRequest } from '#/types/carrier.ts'

interface UpdateCarrierVariables {
  id: string
  data: CreateCarrierRequest
}

export function useUpdateCarrier() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateCarrierVariables>({
    mutationFn: ({ id, data }) => updateCarrierApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] })
      queryClient.invalidateQueries({ queryKey: ['carriers', id] })
      toast.success(CARRIER_CONTENT.toasts.updateSuccess)
    },
    onError: (error) => {
      console.error('Failed to update carrier:', error)
      const message = getApiErrorMessage(
        error,
        CARRIER_CONTENT.toasts.updateError,
      )
      toast.error(message)
    },
  })
}
