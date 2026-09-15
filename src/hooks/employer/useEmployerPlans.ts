import { useQuery } from '@tanstack/react-query'

import { getEmployerPlansApi } from '#/api/employer/employer.api.ts'

import type { EmployerPlansResponse } from '#/types/employer.ts'

export function employerPlansQueryKey(
  employerId?: string,
  carrierGroupNumberId?: string,
) {
  return ['employer-plans', employerId, carrierGroupNumberId] as const
}

export function useEmployerPlans(
  employerId?: string,
  carrierGroupNumberId?: string,
) {
  return useQuery<EmployerPlansResponse, Error>({
    queryKey: employerPlansQueryKey(employerId, carrierGroupNumberId),
    queryFn: () => {
      if (!employerId) {
        return {
          items: [],
          totalCount: 0,
          totalPages: 1,
          page: 1,
          pageSize: 25,
        }
      }
      return getEmployerPlansApi(employerId, carrierGroupNumberId)
    },
    enabled: Boolean(employerId),
  })
}
