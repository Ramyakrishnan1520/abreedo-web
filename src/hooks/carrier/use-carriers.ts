import { useQuery } from '@tanstack/react-query'

import { getCarriersApi } from '#/api/carrier/carrier.api.ts'

import type { PaginationRequest } from '#/types/pagination.ts'

const DEFAULT_PAGINATION: PaginationRequest = {
  pageIndex: 0,
  pageSize: 100,
}

export function useCarriers(pagination?: PaginationRequest) {
  const req = pagination ?? DEFAULT_PAGINATION

  return useQuery({
    queryKey: ['carriers', req.pageIndex, req.pageSize],
    queryFn: () => getCarriersApi(req),
  })
}

