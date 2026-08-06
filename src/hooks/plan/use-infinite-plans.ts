import { useInfiniteQuery } from '@tanstack/react-query'

import { getPlansApi } from '#/api/plan/plan.api.ts'

export const PLAN_INFINITE_PAGE_SIZE = 20

export function useInfinitePlans() {
  return useInfiniteQuery({
    queryKey: ['plans', 'infinite', PLAN_INFINITE_PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      getPlansApi({
        pageIndex: pageParam,
        pageSize: PLAN_INFINITE_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < PLAN_INFINITE_PAGE_SIZE) {
        return undefined
      }

      return allPages.length
    },
  })
}
