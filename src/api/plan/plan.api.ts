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
  const queryParams: Record<string, string | number> = {
    Page: params.pageIndex + 1,
    PageSize: params.pageSize,
  }

  if (params.parentCompanyId && params.parentCompanyId.trim() !== '') {
    queryParams.parentCompanyId = params.parentCompanyId
  }

  if (params.carrierId && params.carrierId.trim() !== '') {
    queryParams.carrierId = params.carrierId
  }

  const { data } = await apiClient.get<PlanListResponse>('/api/v1/Plans', {
    params: queryParams,
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
