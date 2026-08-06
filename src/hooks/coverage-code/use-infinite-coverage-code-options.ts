import { useMemo } from 'react'

import { useInfiniteCoverageCodes } from './use-infinite-coverage-codes.ts'

import type { CoverageCode } from '#/types/coverage-code.ts'

export function useInfiniteCoverageCodeOptions() {
  const query = useInfiniteCoverageCodes()

  const coverageCodes = useMemo<CoverageCode[]>(() => {
    const pages = query.data?.pages ?? []
    const uniqueItems = new Map<string, CoverageCode>()

    for (const page of pages) {
      for (const item of page.items) {
        const id = String(item.id)

        if (id && !uniqueItems.has(id)) {
          uniqueItems.set(id, item)
        }
      }
    }

    return Array.from(uniqueItems.values()).sort((a, b) =>
      a.description.localeCompare(b.description),
    )
  }, [query.data?.pages])

  const totalCount = query.data?.pages[0]?.totalCount ?? 0

  return {
    coverageCodes,
    totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
  }
}
