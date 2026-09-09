import { useInfiniteQuery } from '@tanstack/react-query'

import { getCoverageCodesApi } from '#/api/coverage-code/coverage-code.api.ts'

export const COVERAGE_CODE_INFINITE_PAGE_SIZE = 20

export function useInfiniteCoverageCodes(parentCompanyId?: string) {
  const isParentCompanyParamProvided = parentCompanyId !== undefined
  const isParentCompanyValid = Boolean(
    parentCompanyId && parentCompanyId.trim() !== '',
  )

  return useInfiniteQuery({
    queryKey: [
      'coverage-codes',
      'infinite',
      COVERAGE_CODE_INFINITE_PAGE_SIZE,
      parentCompanyId ?? 'all',
    ],
    enabled: isParentCompanyParamProvided ? isParentCompanyValid : true,
    queryFn: ({ pageParam }) =>
      getCoverageCodesApi(
        {
          pageIndex: pageParam,
          pageSize: COVERAGE_CODE_INFINITE_PAGE_SIZE,
        },
        undefined,
        parentCompanyId,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < COVERAGE_CODE_INFINITE_PAGE_SIZE) {
        return undefined
      }

      return allPages.length
    },
  })
}
