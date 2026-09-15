import { apiClient } from '#/api/api-client.ts'

import type {
  CarrierGroupNumberItem,
  Employer,
  EmployerApiItem,
  EmployerListResponse,
  EmployerPaginatedListResponse,
  EmployerPlanItem,
  EmployerPlansResponse,
  EmployerPlanUpdateRequest,
  EmployerPlansCreateRequest,
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

export async function createEmployerPlanApi(
  id: string,
  data: EmployerPlansCreateRequest,
): Promise<void> {
  await apiClient.post(`/api/v1/employers/${id}/plan`, data)
}

export async function updateEmployerPlanApi(
  id: string,
  data: EmployerPlanUpdateRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/employers/${id}/plan`, data)
}

export async function getCarrierGroupNumbersApi(
  employerGroupId: string,
  request?: PaginationRequest,
): Promise<PaginatedResult<CarrierGroupNumberItem>> {
  const params: Record<string, string | number> = { employerGroupId }
  if (request) {
    params.Page = request.pageIndex + 1
    params.PageSize = request.pageSize
  }

  const { data } = await apiClient.get<
    | CarrierGroupNumberItem[]
    | {
        data?: CarrierGroupNumberItem[]
        items?: CarrierGroupNumberItem[]
        results?: CarrierGroupNumberItem[]
        totalCount?: number
        totalPages?: number
        page?: number
        pageSize?: number
      }
  >('/api/v1/carrier_group_numbers', {
    params,
  })

  if (Array.isArray(data)) {
    const totalCount = data.length
    const pageSize = request?.pageSize ?? 10
    const page = request?.pageIndex ? request.pageIndex + 1 : 1
    const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1)
    return {
      items: data,
      totalCount,
      totalPages,
      page,
      pageSize,
    }
  }

  const items = data.data ?? data.items ?? data.results ?? []
  const totalCount = data.totalCount ?? items.length
  const pageSize = data.pageSize ?? request?.pageSize ?? 10
  const page = data.page ?? (request?.pageIndex ? request.pageIndex + 1 : 1)
  const totalPages =
    data.totalPages ?? Math.max(Math.ceil(totalCount / pageSize), 1)

  return {
    items,
    totalCount,
    totalPages,
    page,
    pageSize,
  }
}

export async function getEmployerPlansApi(
  employerId: string,
  carrierGroupNumberId?: string,
): Promise<EmployerPlansResponse> {
  const params: Record<string, string> = {}
  if (carrierGroupNumberId) {
    params.carrierGroupNumberId = carrierGroupNumberId
  }

  const { data } = await apiClient.get<
    EmployerPlansResponse | EmployerPlanItem[]
  >(`/api/v1/employers/${employerId}/plans`, {
    params,
  })

  if (Array.isArray(data)) {
    return {
      items: data,
      totalCount: data.length,
      totalPages: 1,
      page: 1,
      pageSize: data.length,
    }
  }

  return {
    items: data.items ?? [],
    page: data.page ?? 1,
    pageSize: data.pageSize ?? 25,
    totalCount: data.totalCount ?? (data.items?.length ?? 0),
    totalPages: data.totalPages ?? 1,
  }
}

export async function deleteEmployerApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/employers/${id}`)
}
