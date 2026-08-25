import { useQuery } from '@tanstack/react-query'

import { getPlanByIdApi } from '#/api/plan/plan.api.ts'

export function usePlan(id: string | undefined) {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Plan id is required')
      }

      return getPlanByIdApi(id)
    },
    enabled: Boolean(id),
  })
}
