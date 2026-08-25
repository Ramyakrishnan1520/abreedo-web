import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getCommissionCodesApi } from '#/api/commission-code/commission-code.api.ts'

import type { SelectOption } from '#/components/admin/common/ConfigurableSelect.tsx'
import type { CommissionCodeApiItem } from '#/types/commission-code.ts'

export function useCommissionCodeOptions() {
  const query = useQuery({
    queryKey: ['commission-codes'],
    queryFn: getCommissionCodesApi,
    staleTime: 5 * 60 * 1000,
  })

  const rawItems = useMemo<CommissionCodeApiItem[]>(() => {
    if (!query.data) return []
    if (Array.isArray(query.data)) return query.data
    return query.data.items ?? []
  }, [query.data])

  const options = useMemo<SelectOption[]>(() => {
    return rawItems.map((item) => {
      const label = item.name
        ? item.code
          ? `${item.name} (${item.code})`
          : item.name
        : item.code || item.commissionCodeId

      return {
        value: item.commissionCodeId,
        label,
      }
    })
  }, [rawItems])

  return {
    options,
    items: rawItems,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  }
}
