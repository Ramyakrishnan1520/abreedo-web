import { useInfiniteCarrierOptions } from '#/hooks/carrier/use-infinite-carrier-options.ts'

import type { AvailableCarrierOption } from '#/types/parent-company.ts'

export function useAvailableCarriers() {
  const {
    carriers,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCarrierOptions()

  const carrierOptions: AvailableCarrierOption[] = carriers.map((carrier) => ({
    id: String(carrier.id),
    name: carrier.name,
  }))

  return {
    carriers: carrierOptions,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  }
}
