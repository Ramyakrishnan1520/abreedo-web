import { useInfiniteQuery } from '@tanstack/react-query'

import { getPlansApi } from '#/api/plan/plan.api.ts'

export const PLAN_INFINITE_PAGE_SIZE = 20

export interface UseInfinitePlansParams {
  parentCompanyId?: string
  carrierId?: string
  search?: string
}

export function useInfinitePlans(params?: UseInfinitePlansParams) {
  const parentCompanyId = params?.parentCompanyId
  const carrierId = params?.carrierId
  const search = params?.search

  return useInfiniteQuery({
    queryKey: [
      'plans',
      'infinite',
      PLAN_INFINITE_PAGE_SIZE,
      parentCompanyId ?? null,
      carrierId ?? null,
      search ?? null,
    ],
    queryFn: ({ pageParam }) =>
      getPlansApi({
        pageIndex: pageParam,
        pageSize: PLAN_INFINITE_PAGE_SIZE,
        parentCompanyId,
        carrierId,
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
