import { useMemo } from 'react'

import { useInfinitePlans } from './use-infinite-plans.ts'

import type { Plan } from '#/types/plan.ts'

export function useInfinitePlanOptions() {
  const query = useInfinitePlans()

  const plans = useMemo<Plan[]>(() => {
    const pages = query.data?.pages ?? []
    const uniquePlans = new Map<string, Plan>()

    for (const page of pages) {
      for (const plan of page.items) {
        const id = String(plan.id)

        if (id && !uniquePlans.has(id)) {
          uniquePlans.set(id, plan)
        }
      }
    }

    return Array.from(uniquePlans.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }, [query.data?.pages])

  const totalCount = query.data?.pages[0]?.totalCount ?? 0

  return {
    plans,
    totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
  }
}
