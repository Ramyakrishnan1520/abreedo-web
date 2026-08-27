import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { checkCarrierGroupNumberExistsApi } from '#/api/carrier/carrier.api.ts'

export function carrierGroupNumberExistsQueryKey(groupNumber: string) {
  return ['carriers', 'groupNumber', groupNumber.trim(), 'exists'] as const
}

export function useCheckCarrierGroupNumberExists() {
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)

  const checkGroupNumberExists = useCallback(
    async (groupNumber: string): Promise<boolean> => {
      const trimmed = groupNumber.trim()
      if (!trimmed) {
        return false
      }

      setIsPending(true)
      try {
        return await queryClient.fetchQuery({
          queryKey: carrierGroupNumberExistsQueryKey(trimmed),
          queryFn: () => checkCarrierGroupNumberExistsApi(trimmed),
          staleTime: 30_000,
        })
      } finally {
        setIsPending(false)
      }
    },
    [queryClient],
  )

  return {
    checkGroupNumberExists,
    isPending,
  }
}
