import { useEffect, useRef } from 'react'

interface UseLoadMoreIntersectionOptions {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => Promise<unknown>
  enabled?: boolean
  root?: Element | null
}

export function useLoadMoreIntersection({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  enabled = true,
  root = null,
}: UseLoadMoreIntersectionOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const sentinel = sentinelRef.current

    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      {
        root,
        rootMargin: '48px',
        threshold: 0,
      },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [enabled, fetchNextPage, hasNextPage, isFetchingNextPage, root])

  return sentinelRef
}
