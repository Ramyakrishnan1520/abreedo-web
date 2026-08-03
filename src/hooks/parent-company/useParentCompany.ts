import { useQuery } from '@tanstack/react-query'

import { getParentCompanyByIdApi } from '#/api/parent-company/parent-company.api.ts'

export function useParentCompany(id: string | undefined) {
  return useQuery({
    queryKey: ['parent-companies', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Parent company id is required')
      }

      return getParentCompanyByIdApi(id)
    },
    enabled: Boolean(id),
  })
}
