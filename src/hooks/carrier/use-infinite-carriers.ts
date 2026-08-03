import { useInfiniteQuery } from '@tanstack/react-query'

import { getCarriersApi } from '#/api/carrier/carrier.api.ts'

export const CARRIER_INFINITE_PAGE_SIZE = 20

export function useInfiniteCarriers() {
  return useInfiniteQuery({
    queryKey: ['carriers', 'infinite', CARRIER_INFINITE_PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      getCarriersApi({
        pageIndex: pageParam,
        pageSize: CARRIER_INFINITE_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < CARRIER_INFINITE_PAGE_SIZE) {
        return undefined
      }

      return allPages.length
    },
  })
}
