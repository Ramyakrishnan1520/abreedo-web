import { useInfiniteParentCompanyOptions } from './use-infinite-parent-company-options.ts'

export function useAvailableParentCompanies() {
  const {
    parentCompanies,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteParentCompanyOptions()

  return {
    parentCompanies,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  }
}
