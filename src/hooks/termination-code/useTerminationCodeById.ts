import { useQuery } from '@tanstack/react-query'

import { getTerminationCodeByIdApi } from '#/api/termination-code/termination-code.api.ts'

export function useTerminationCodeById(id?: string) {
  return useQuery({
    queryKey: ['termination-codes', id],
    queryFn: () => getTerminationCodeByIdApi(id!),
    enabled: Boolean(id),
  })
}
