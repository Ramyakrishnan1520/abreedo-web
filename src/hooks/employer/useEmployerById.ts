import { useQuery } from '@tanstack/react-query'

import { getEmployerByIdApi } from '#/api/employer/employer.api.ts'

export function useEmployer(id: string | undefined) {
  return useQuery({
    queryKey: ['employers', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Employer id is required')
      }
      return getEmployerByIdApi(id)
    },
    enabled: Boolean(id),
  })
}

export { useEmployer as useEmployerById }
