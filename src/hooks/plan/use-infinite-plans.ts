import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { getPlansApi } from '#/api/plan/plan.api.ts'

export const PLAN_INFINITE_PAGE_SIZE = 20

export interface UseInfinitePlansParams {
  parentCompanyId?: string
  carrierId?: string
  carrierIds?: string[]
  search?: string
}

export function useInfinitePlans(params?: UseInfinitePlansParams) {
  const parentCompanyId = params?.parentCompanyId
  const carrierId = params?.carrierId
  const carrierIds = params?.carrierIds
  const search = params?.search

  const sortedCarrierIds = useMemo(
    () => (carrierIds ? [...carrierIds].sort() : undefined),
    [carrierIds],
  )

  return useInfiniteQuery({
    queryKey: [
      'plans',
      'infinite',
      PLAN_INFINITE_PAGE_SIZE,
      parentCompanyId ?? null,
      carrierId ?? null,
      sortedCarrierIds ?? null,
      search ?? null,
    ],
    queryFn: ({ pageParam }) =>
      getPlansApi({
        pageIndex: pageParam,
        pageSize: PLAN_INFINITE_PAGE_SIZE,
        parentCompanyId,
        carrierId,
        carrierIds: sortedCarrierIds,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < PLAN_INFINITE_PAGE_SIZE) {
        return undefined
      }

      return allPages.length
    },
    staleTime: 5 * 60 * 1000,
  })
}
