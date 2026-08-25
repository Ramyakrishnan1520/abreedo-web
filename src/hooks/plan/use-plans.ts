import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getPlansApi } from '#/api/plan/plan.api.ts'

import type { PaginationState } from '@tanstack/react-table'

interface UsePlansOptions {
  pagination: PaginationState
  parentCompanyId?: string
  carrierId?: string
  search?: string
}

export function usePlans({
  pagination,
  parentCompanyId,
  carrierId,
  search,
}: UsePlansOptions) {
  return useQuery({
    queryKey: [
      'plans',
      pagination.pageIndex,
      pagination.pageSize,
      parentCompanyId,
      carrierId,
      search,
    ],
    queryFn: () =>
      getPlansApi({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        parentCompanyId,
        carrierId,
        search,
      }),
    placeholderData: keepPreviousData,
  })
}
