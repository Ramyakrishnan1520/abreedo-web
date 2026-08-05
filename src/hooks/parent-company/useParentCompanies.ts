import { useQuery } from '@tanstack/react-query'

import { getParentCompaniesApi } from '#/api/parent-company/parent-company.api.ts'

export function useParentCompanies() {
  const query = useQuery({
    queryKey: ['parent-companies'],
    queryFn: () => getParentCompaniesApi(),
  })

  return {
    ...query,
    data: query.data?.items ?? [],
  }
}
