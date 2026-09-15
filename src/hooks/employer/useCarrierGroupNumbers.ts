import { useQuery } from '@tanstack/react-query'

import { getCarrierGroupNumbersApi } from '#/api/employer/employer.api.ts'

import type { CarrierGroupNumberItem } from '#/types/employer.ts'
import type { PaginatedResult, PaginationRequest } from '#/types/pagination.ts'

export function carrierGroupNumbersQueryKey(
  employerGroupId?: string,
  request?: PaginationRequest,
) {
  return [
    'carrier-group-numbers',
    employerGroupId,
    request?.pageIndex,
    request?.pageSize,
  ] as const
}

export function useCarrierGroupNumbers(
  employerGroupId?: string,
  request?: PaginationRequest,
) {
  return useQuery<PaginatedResult<CarrierGroupNumberItem>, Error>({
    queryKey: carrierGroupNumbersQueryKey(employerGroupId, request),
    queryFn: () => {
      if (!employerGroupId) {
        return {
          items: [],
          totalCount: 0,
          totalPages: 1,
          page: 1,
          pageSize: request?.pageSize ?? 10,
        }
      }
      return getCarrierGroupNumbersApi(employerGroupId, request)
    },
    enabled: Boolean(employerGroupId),
  })
}
