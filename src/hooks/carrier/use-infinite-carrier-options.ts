import { useMemo } from 'react'

import { useInfiniteCarriers } from '#/hooks/carrier/use-infinite-carriers.ts'

import type { Carrier } from '#/types/carrier.ts'

export function useInfiniteCarrierOptions() {
  const query = useInfiniteCarriers()

  const carriers = useMemo<Carrier[]>(() => {
    const pages = query.data?.pages ?? []
    const uniqueCarriers = new Map<string, Carrier>()

    for (const page of pages) {
      for (const carrier of page.items) {
        const id = String(carrier.id)

        if (!uniqueCarriers.has(id)) {
          uniqueCarriers.set(id, carrier)
        }
      }
    }

    return Array.from(uniqueCarriers.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }, [query.data?.pages])

  const totalCount = query.data?.pages[0]?.totalCount ?? 0

  return {
    carriers,
    totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
  }
}
