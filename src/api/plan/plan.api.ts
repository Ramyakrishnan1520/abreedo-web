import { apiClient } from '#/api/api-client.ts'

import type {
  CreatePlanRequest,
  CreatePlanResponse,
  GetPlansQueryParams,
  Plan,
  PlanApiItem,
  PlanDtoPagedResult,
  PlanListResponse,
} from '#/types/plan.ts'
import type { PaginatedResult, PaginationRequest } from '#/types/pagination.ts'

function formatDateString(dateStr?: string | null): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-US')
  } catch {
    return dateStr
  }
}

function mapPlan(item: PlanApiItem): Plan {
  return {
    id: item.planId,
    name: item.name ?? '',
    code: item.code ?? '',
    coverageCodeTitle: item.coverageCodeTitle ?? '',
    option: item.option ?? '',
    effectiveDate: formatDateString(item.effectiveDate),
    carrierId: item.carrierId ?? '',
    carrierName: item.carrierName ?? '',
  }
}

function getPaginationResult(
  items: Plan[],
  request: PaginationRequest,
  response?: PlanDtoPagedResult,
): PaginatedResult<Plan> {
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

export async function createPlanApi(
  data: CreatePlanRequest,
): Promise<CreatePlanResponse> {
  const response = await apiClient.post<CreatePlanResponse>(
    '/api/v1/Plans',
    data,
  )

  return response.data
}

export async function getPlansApi(
  params: GetPlansQueryParams,
): Promise<PaginatedResult<Plan>> {
  const searchParams = new URLSearchParams()
  searchParams.append('Page', String(params.pageIndex + 1))
  searchParams.append('PageSize', String(params.pageSize))

  if (params.parentCompanyId && params.parentCompanyId.trim() !== '') {
    searchParams.append('parentCompanyId', params.parentCompanyId.trim())
  }

  if (params.carrierIds && params.carrierIds.length > 0) {
    for (const carrierId of params.carrierIds) {
      if (carrierId && carrierId.trim() !== '') {
        searchParams.append('carrierIds', carrierId.trim())
      }
    }
  } else if (params.carrierId && params.carrierId.trim() !== '') {
    searchParams.append('carrierId', params.carrierId.trim())
  }

  if (params.search && params.search.trim() !== '') {
    searchParams.append('search', params.search.trim())
  }

  const { data } = await apiClient.get<PlanListResponse>('/api/v1/Plans', {
    params: searchParams,
  })

  const request: PaginationRequest = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  }

  if (Array.isArray(data)) {
    return getPaginationResult(data.map(mapPlan), request)
  }

  const items = (data.items ?? []).map(mapPlan)
  return getPaginationResult(items, request, data)
}

export async function getPlanByIdApi(id: string): Promise<PlanApiItem> {
  const { data } = await apiClient.get<PlanApiItem>(`/api/v1/Plans/${id}`)
  return data
}

export async function updatePlanApi(
  id: string,
  data: CreatePlanRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/Plans/${id}`, data)
}

export async function deletePlanApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/Plans/${id}`)
}
