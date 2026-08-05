import { useMemo } from 'react'

import { useInfiniteParentCompanies } from './use-infinite-parent-companies.ts'

import type { ParentCompanyListItem } from '#/types/parent-company.ts'

export function useInfiniteParentCompanyOptions() {
  const query = useInfiniteParentCompanies()

  const parentCompanies = useMemo<ParentCompanyListItem[]>(() => {
    const pages = query.data?.pages ?? []
    const uniqueItems = new Map<string, ParentCompanyListItem>()

    for (const page of pages) {
      for (const item of page.items) {
        const id = String(item.id)

        if (id && !uniqueItems.has(id)) {
          uniqueItems.set(id, item)
        }
      }
    }

    return Array.from(uniqueItems.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }, [query.data?.pages])

  const totalCount = query.data?.pages[0]?.totalCount ?? 0

  return {
    parentCompanies,
    totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
  }
}
