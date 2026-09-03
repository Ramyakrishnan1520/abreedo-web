import { useInfiniteQuery } from '@tanstack/react-query'

import { getBrokerCodesApi } from '#/api/broker-code/broker-code.api.ts'

export const BROKER_CODE_INFINITE_PAGE_SIZE = 20

export function useInfiniteBrokerCodes() {
  return useInfiniteQuery({
    queryKey: ['broker-codes', 'infinite', BROKER_CODE_INFINITE_PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      getBrokerCodesApi({
        pageIndex: pageParam,
        pageSize: BROKER_CODE_INFINITE_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < BROKER_CODE_INFINITE_PAGE_SIZE) {
        return undefined
      }
      return allPages.length
    },
    staleTime: 5 * 60 * 1000,
  })
}
