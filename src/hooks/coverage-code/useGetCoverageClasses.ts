import { useQuery } from '@tanstack/react-query'

import { getCoverageClassesApi } from '#/api/coverage-code/coverage-code.api.ts'

import type { GetCoverageClassesResponse } from '#/types/coverage-code.ts'

export function useGetCoverageClasses() {
  return useQuery<GetCoverageClassesResponse, Error>({
    queryKey: ['coverage-classes'],
    queryFn: getCoverageClassesApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
