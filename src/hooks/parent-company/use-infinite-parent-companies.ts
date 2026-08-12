import { useInfiniteQuery } from '@tanstack/react-query'

import { getParentCompaniesApi } from '#/api/parent-company/parent-company.api.ts'

export const PARENT_COMPANY_INFINITE_PAGE_SIZE = 20

export function useInfiniteParentCompanies() {
  return useInfiniteQuery({
    queryKey: [
      'parent-companies',
      'infinite',
      PARENT_COMPANY_INFINITE_PAGE_SIZE,
    ],
    refetchOnWindowFocus: false,
    queryFn: ({ pageParam }) =>
      getParentCompaniesApi({
        pageIndex: pageParam,
        pageSize: PARENT_COMPANY_INFINITE_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < PARENT_COMPANY_INFINITE_PAGE_SIZE) {
        return undefined
      }

      return allPages.length
    },
  })
}
