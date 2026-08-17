import { useQuery } from '@tanstack/react-query'

import { getTerminationCodesApi } from '#/api/termination-code/termination-code.api.ts'

import type { PaginationRequest } from '#/types/pagination.ts'

const DEFAULT_PAGINATION: PaginationRequest = {
  pageIndex: 0,
  pageSize: 100,
}

export function useTerminationCodes(
  pagination?: PaginationRequest,
  search?: string,
) {
  const req = pagination ?? DEFAULT_PAGINATION

  return useQuery({
    queryKey: [
      'termination-codes',
      req.pageIndex,
      req.pageSize,
      search ?? '',
    ],
    queryFn: () => getTerminationCodesApi(req, search),
  })
}
