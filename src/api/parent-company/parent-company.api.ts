import { apiClient } from '#/api/api-client.ts'

import type {
  CreateParentCompanyRequest,
  CreateParentCompanyResponse,
  ParentCompanyApiItem,
  ParentCompanyListItem,
  ParentCompanyListResponse,
} from '#/types/parent-company.ts'
import type { PaginatedResult, PaginationRequest } from '#/types/pagination.ts'

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

export async function getParentCompaniesApi(
  request?: PaginationRequest,
): Promise<PaginatedResult<ParentCompanyListItem>> {
  const { data } = await apiClient.get<ParentCompanyListResponse>(
    '/api/v1/parent-companies',
    request
      ? {
          params: {
            Page: request.pageIndex + 1,
            PageSize: request.pageSize,
          },
        }
      : undefined,
  )

  const items = extractParentCompanyItems(data)
    .map(mapParentCompanyListItem)
    .filter((item) => item.id.length > 0)

  if (Array.isArray(data)) {
    return {
      items,
      page: request ? request.pageIndex + 1 : 1,
      pageSize: request ? request.pageSize : items.length,
      totalCount: items.length,
      totalPages: 1,
    }
  }

  const totalCount = data.totalCount ?? items.length
  const pageSize = data.pageSize ?? (request ? request.pageSize : items.length)

  return {
    items,
    page: data.page ?? (request ? request.pageIndex + 1 : 1),
    pageSize,
    totalCount,
    totalPages:
      data.totalPages ?? Math.max(Math.ceil(totalCount / pageSize), 1),
  }
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
