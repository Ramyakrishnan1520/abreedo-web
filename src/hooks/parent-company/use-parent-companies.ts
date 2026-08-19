import { useQuery } from '@tanstack/react-query'

import { getParentCompaniesApi } from '#/api/parent-company/parent-company.api.ts'

import type { PaginationRequest } from '#/types/pagination.ts'

const DEFAULT_PAGINATION: PaginationRequest = {
  pageIndex: 0,
  pageSize: 10,
}

export function useParentCompanies(
  pagination?: PaginationRequest,
  search?: string,
) {
  const req = pagination ?? DEFAULT_PAGINATION

  return useQuery({
    queryKey: ['parent-companies', req.pageIndex, req.pageSize, search ?? ''],
    queryFn: () => getParentCompaniesApi(req, search),
  })
}
