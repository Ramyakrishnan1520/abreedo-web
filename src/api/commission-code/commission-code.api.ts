import { apiClient } from '#/api/api-client.ts'

import type { CommissionCodeListResponse } from '#/types/commission-code.ts'

export async function getCommissionCodesApi(): Promise<CommissionCodeListResponse> {
  const { data } =
    await apiClient.get<CommissionCodeListResponse>('/api/v1/commission-codes')
  return data
}
