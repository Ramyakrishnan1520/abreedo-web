import { useQuery } from '@tanstack/react-query'

import { getEmployersApi } from '#/api/employer/employer.api.ts'

import type { PaginationRequest } from '#/types/pagination.ts'

const DEFAULT_PAGINATION: PaginationRequest = {
  pageIndex: 0,
  pageSize: 10,
}

export function useEmployers(
  parentCompanyId?: string,
  pagination?: PaginationRequest,
  search?: string,
) {
  const req = pagination ?? DEFAULT_PAGINATION

  return useQuery({
    queryKey: [
      'employers',
      parentCompanyId ?? 'all',
      req.pageIndex,
      req.pageSize,
      search ?? '',
    ],
    queryFn: () => getEmployersApi(req, parentCompanyId, search),
  })
}
