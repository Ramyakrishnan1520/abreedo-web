import { useQuery } from '@tanstack/react-query'

import { getStatesApi } from '#/api/carrier/carrier.api.ts'
import type { GetStatesResponse } from '#/types/carrier.ts'

export function useGetStates() {
  return useQuery<GetStatesResponse, Error>({
    queryKey: ['states'],
    queryFn: getStatesApi,
    staleTime: Infinity, // states list rarely changes — cache indefinitely per session
    gcTime: 5 * 60 * 1000,
  })
}
