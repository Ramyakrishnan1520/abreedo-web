import { apiClient } from '#/api/api-client.ts'

import type {
  CoverageCode,
  CoverageCodeApiItem,
  CoverageCodeDtoPagedResult,
  CoverageCodeListResponse,
  CoverageCodePaginatedListResponse,
  CoverageCodeUpsertRequest,
  GetCoverageClassesResponse,
  GetCoverageTypesResponse,
} from '#/types/coverage-code.ts'
import type {
  PaginatedResult,
  PaginationRequest,
} from '#/types/pagination.ts'

function mapCoverageCode(item: CoverageCodeApiItem): CoverageCode {
  const codeName = item.title ?? item.description ?? ''
  return {
    id: item.coverageCodeId ?? item.id ?? item.code,
    code: item.code,
    name: codeName,
    description: codeName,
    carrierId: item.carrierId,
    carrierName: item.carrierName,
    matrixName: item.matrixName,
  }
}

function getPaginationResult(
  items: CoverageCode[],
  request: PaginationRequest,
  response?: CoverageCodePaginatedListResponse,
): PaginatedResult<CoverageCode> {
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

export async function createCoverageCodeApi(
  data: CoverageCodeUpsertRequest,
): Promise<CoverageCodeDtoPagedResult> {
  const response = await apiClient.post<CoverageCodeDtoPagedResult>(
    '/api/v1/coverageCodes',
    data,
  )

  return response.data
}

export async function getCoverageClassesApi(): Promise<GetCoverageClassesResponse> {
  const response = await apiClient.get<GetCoverageClassesResponse>(
    '/api/v1/coverageCodes/coverageClass',
  )

  return response.data
}

export async function getCoverageTypesApi(): Promise<GetCoverageTypesResponse> {
  const response = await apiClient.get<GetCoverageTypesResponse>(
    '/api/v1/coverageCodes/coverageTypes',
  )

  return response.data
}

export async function getCoverageCodesApi(
  request: PaginationRequest,
  search?: string,
): Promise<PaginatedResult<CoverageCode>> {
  const { data } = await apiClient.get<CoverageCodeListResponse>(
    '/api/v1/coverageCodes',
    {
      params: {
        page: request.pageIndex + 1,
        pageSize: request.pageSize,
        search: search?.trim() || undefined,
      },
    },
  )

  if (Array.isArray(data)) {
    return getPaginationResult(data.map(mapCoverageCode), request)
  }

  return getPaginationResult(
    (data.data ?? data.coverageCodes ?? data.items ?? data.results ?? []).map(
      mapCoverageCode,
    ),
    request,
    data,
  )
}

export async function getCoverageCodeByIdApi(
  id: string,
): Promise<CoverageCodeApiItem> {
  const { data } = await apiClient.get<CoverageCodeApiItem>(
    `/api/v1/coverageCodes/${id}`,
  )

  return data
}

export async function updateCoverageCodeApi(
  id: string,
  data: CoverageCodeUpsertRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/coverageCodes/${id}`, data)
}

export async function deleteCoverageCodeApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/coverageCodes/${id}`)
}



