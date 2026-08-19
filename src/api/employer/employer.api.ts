import { apiClient } from '#/api/api-client.ts'

import type {
  Employer,
  EmployerApiItem,
  EmployerListResponse,
  EmployerPaginatedListResponse,
  EmployerUpsertRequest,
} from '#/types/employer.ts'
import type {
  PaginatedResult,
  PaginationRequest,
} from '#/types/pagination.ts'

function mapEmployer(item: EmployerApiItem): Employer {
  return {
    id: item.employerId || item.id || '',
    name: item.name ?? '',
    parentCompanyId: item.parentCompanyId ?? '',
    parentCompanyName: item.parentCompanyName ?? '',
  }
}

function getPaginationResult(
  items: Employer[],
  request: PaginationRequest,
  response?: EmployerPaginatedListResponse,
): PaginatedResult<Employer> {
  const totalCount = response?.totalCount ?? items.length
  const pageSize = response?.pageSize ?? request.pageSize

  return {
    items,
    page: response?.page ?? request.pageIndex + 1,
    pageSize,
    totalCount,
    totalPages:
      response?.totalPages ?? Math.max(Math.ceil(totalCount / pageSize), 1),
  }
}

export async function getEmployersApi(
  request: PaginationRequest,
  parentCompanyId?: string,
  search?: string,
): Promise<PaginatedResult<Employer>> {
  const params: Record<string, string | number> = {
    Page: request.pageIndex + 1,
    PageSize: request.pageSize,
  }

  if (parentCompanyId) {
    params.parentCompanyId = parentCompanyId
  }

  if (search?.trim()) {
    params.search = search.trim()
  }

  const { data } = await apiClient.get<EmployerListResponse>(
    '/api/v1/employers',
    { params },
  )

  if (Array.isArray(data)) {
    return getPaginationResult(data.map(mapEmployer), request)
  }

  const itemsList =
    data.data ?? data.employers ?? data.items ?? data.results ?? []

  return getPaginationResult(itemsList.map(mapEmployer), request, data)
}

export async function getEmployerByIdApi(
  id: string,
): Promise<EmployerApiItem> {
  const { data } = await apiClient.get<EmployerApiItem>(
    `/api/v1/employers/${id}`,
  )

  return data
}

export async function createEmployerApi(
  data: EmployerUpsertRequest,
): Promise<EmployerApiItem> {
  const response = await apiClient.post<EmployerApiItem>(
    '/api/v1/employers',
    data,
  )

  return response.data
}

export async function updateEmployerApi(
  id: string,
  data: EmployerUpsertRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/employers/${id}`, data)
}

export async function deleteEmployerApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/employers/${id}`)
}
