import { useQuery } from '@tanstack/react-query'

import { getCarrierByIdApi } from '#/api/carrier/carrier.api.ts'

export function useCarrier(id: string | undefined) {
  return useQuery({
    queryKey: ['carriers', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Carrier id is required')
      }

      return getCarrierByIdApi(id)
    },
    enabled: Boolean(id),
  })
}
