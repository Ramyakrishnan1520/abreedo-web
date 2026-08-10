import { useQuery } from '@tanstack/react-query'

import { getCoverageCodeByIdApi } from '#/api/coverage-code/coverage-code.api.ts'

export function useCoverageCodeById(id: string | undefined) {
  return useQuery({
    queryKey: ['coverage-codes', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Coverage code id is required')
      }

      return getCoverageCodeByIdApi(id)
    },
    enabled: Boolean(id),
  })
}
