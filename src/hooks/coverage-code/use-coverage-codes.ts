import { useQuery } from '@tanstack/react-query'

import { getCoverageCodesApi } from '#/api/coverage-code/coverage-code.api.ts'

import type { PaginationRequest } from '#/types/pagination.ts'

export function useCoverageCodes(
  pagination: PaginationRequest,
  search?: string,
) {
  return useQuery({
    queryKey: [
      'coverage-codes',
      pagination.pageIndex,
      pagination.pageSize,
      search ?? '',
    ],
    queryFn: () => getCoverageCodesApi(pagination, search),
  })
}
