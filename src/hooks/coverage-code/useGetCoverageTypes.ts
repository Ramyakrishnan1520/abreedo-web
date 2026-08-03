import { useQuery } from '@tanstack/react-query'

import { getCoverageTypesApi } from '#/api/coverage-code/coverage-code.api.ts'

import type { GetCoverageTypesResponse } from '#/types/coverage-code.ts'

export function useGetCoverageTypes() {
  return useQuery<GetCoverageTypesResponse, Error>({
    queryKey: ['coverage-types'],
    queryFn: getCoverageTypesApi,
  })
}
