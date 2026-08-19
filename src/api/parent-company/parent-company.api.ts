import { apiClient } from '#/api/api-client.ts'

import type {
  CreateParentCompanyRequest,
  CreateParentCompanyResponse,
  ParentCompany,
  ParentCompanyApiItem,
  ParentCompanyListResponse,
} from '#/types/parent-company.ts'
import type { PaginatedResult, PaginationRequest } from '#/types/pagination.ts'

function mapParentCompany(item: ParentCompanyApiItem): ParentCompany {
  const contactName = [
    item.contactFirst ?? item.contact?.firstName,
    item.contactLast ?? item.contact?.lastName,
  ]
    .filter(Boolean)
    .join(' ')

  return {
    id: item.parentCompanyId ?? item.id ?? '',
    name: item.name ?? '',
    contactName:
      contactName || item.contactFirst || item.contact?.firstName || '',
    phone: item.phone ?? item.contact?.phoneNumber ?? '',
    email: item.email ?? item.contact?.email ?? '',
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
  search?: string,
): Promise<PaginatedResult<ParentCompany>> {
  const params: Record<string, unknown> = {}
  if (request) {
    params.page = request.pageIndex + 1
    params.pageSize = request.pageSize
  }
  if (search?.trim()) {
    params.search = search.trim()
  }

  const { data } = await apiClient.get<ParentCompanyListResponse>(
    '/api/v1/parent-companies',
    Object.keys(params).length > 0 ? { params } : undefined,
  )

  const items = extractParentCompanyItems(data)
    .map(mapParentCompany)
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

export async function deleteParentCompanyApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/parent-companies/${id}`)
}
