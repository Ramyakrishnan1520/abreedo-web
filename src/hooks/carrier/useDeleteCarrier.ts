import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteCarrierApi } from '#/api/carrier/carrier.api.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'

export function useDeleteCarrier() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteCarrierApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] })
      queryClient.invalidateQueries({ queryKey: ['carriers', id] })
      toast.success(CARRIER_CONTENT.toasts.deleteSuccess)
    },
    onError: (error) => {
      console.error('Failed to delete carrier:', error.message)
      toast.error(CARRIER_CONTENT.toasts.deleteError)
    },
  })
}
