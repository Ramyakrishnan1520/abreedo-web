import { useQuery } from '@tanstack/react-query'

import { getParentCompaniesApi } from '#/api/parent-company/parent-company.api.ts'

export function useParentCompanies() {
  return useQuery({
    queryKey: ['parent-companies'],
    queryFn: getParentCompaniesApi,
  })
}
