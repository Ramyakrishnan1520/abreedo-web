import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getPlansApi } from '#/api/plan/plan.api.ts'

import type { PaginationState } from '@tanstack/react-table'

interface UsePlansOptions {
  pagination: PaginationState
  parentCompanyId?: string
  carrierId?: string
}

export function usePlans({
  pagination,
  parentCompanyId,
  carrierId,
}: UsePlansOptions) {
  return useQuery({
    queryKey: [
      'plans',
      pagination.pageIndex,
      pagination.pageSize,
      parentCompanyId,
      carrierId,
    ],
    queryFn: () =>
      getPlansApi({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        parentCompanyId,
        carrierId,
      }),
      placeholderData: keepPreviousData,
  })
}
