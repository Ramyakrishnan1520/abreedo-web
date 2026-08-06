import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getGroupTypeLookupCodesApi } from '#/api/lookup-code/lookup-code.api.ts'

import type { SelectOption } from '#/components/admin/plan/ConfigurableSelect.tsx'

export function useGroupTypeOptions() {
  const query = useQuery({
    queryKey: ['lookup-codes', 'group-type'],
    queryFn: getGroupTypeLookupCodesApi,
  })

  const options = useMemo<SelectOption[]>(() => {
    const items = query.data ?? []

    return items.map((item) => ({
      value: item.codeId,
      label: item.codeName,
    }))
  }, [query.data])

  return {
    options,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  }
}
