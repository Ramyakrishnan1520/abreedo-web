import { useQuery } from '@tanstack/react-query'

import { getBrokerCodesApi } from '#/api/broker-code/broker-code.api.ts'

import type { PaginationRequest } from '#/types/pagination.ts'

export function useBrokerCodes(
  pagination: PaginationRequest = { pageIndex: 0, pageSize: 100 },
  search?: string,
) {
  return useQuery({
    queryKey: ['broker-codes', pagination.pageIndex, pagination.pageSize, search],
    queryFn: () =>
      getBrokerCodesApi({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search,
      }),
    staleTime: 5 * 60 * 1000,
  })
}
