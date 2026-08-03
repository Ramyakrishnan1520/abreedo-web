import { apiClient } from '#/api/api-client.ts'

import type {
  CreateParentCompanyRequest,
  CreateParentCompanyResponse,
} from '#/types/parent-company.ts'

export async function createParentCompanyApi(
  data: CreateParentCompanyRequest,
): Promise<CreateParentCompanyResponse> {
  const response = await apiClient.post<CreateParentCompanyResponse>(
    '/api/v1/parent-companies',
    data,
  )

  return response.data
}
