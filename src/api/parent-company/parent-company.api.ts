import { apiClient } from '#/api/api-client.ts'

import type {
  CreateParentCompanyRequest,
  CreateParentCompanyResponse,
  ParentCompanyApiItem,
  ParentCompanyListItem,
  ParentCompanyListResponse,
} from '#/types/parent-company.ts'

function mapParentCompanyListItem(
  item: ParentCompanyApiItem,
): ParentCompanyListItem {
  return {
    id: item.parentCompanyId ?? item.id ?? '',
    name: item.name,
  }
}

function extractParentCompanyItems(
  data: ParentCompanyListResponse,
): ParentCompanyApiItem[] {
  if (Array.isArray(data)) {
    return data
  }

  return (
    data.data ??
    data.parentCompanies ??
    data.items ??
    data.results ??
    []
  )
}

export async function createParentCompanyApi(
  data: CreateParentCompanyRequest,
): Promise<CreateParentCompanyResponse> {
  const response = await apiClient.post<CreateParentCompanyResponse>(
    '/api/v1/parent-companies',
    data,
  )

  return response.data
}

export async function getParentCompaniesApi(): Promise<
  ParentCompanyListItem[]
> {
  const { data } = await apiClient.get<ParentCompanyListResponse>(
    '/api/v1/parent-companies',
  )

  return extractParentCompanyItems(data)
    .map(mapParentCompanyListItem)
    .filter((item) => item.id.length > 0)
}

export async function getParentCompanyByIdApi(
  id: string,
): Promise<ParentCompanyApiItem> {
  const { data } = await apiClient.get<ParentCompanyApiItem>(
    `/api/v1/parent-companies/${id}`,
  )

  return data
}

export async function updateParentCompanyApi(
  id: string,
  data: CreateParentCompanyRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/parent-companies/${id}`, data)
}
