import { apiClient } from '#/api/api-client.ts'

import type {
  CreateTerminationCodeRequest,
  TerminationCode,
  TerminationCodeApiItem,
  TerminationCodeListResponse,
  TerminationCodePaginatedListResponse,
} from '#/types/termination-code.ts'
import type {
  PaginatedResult,
  PaginationRequest,
} from '#/types/pagination.ts'

function mapTerminationCode(item: TerminationCodeApiItem): TerminationCode {
  const isNotice = item.actionCode === 1
  const coverageMonthNum =
    typeof item.coverageMonth === 'number'
      ? item.coverageMonth
      : Number(item.coverageMonth) || 0

  return {
    id: item.terminationCodeId ?? item.id ?? item.code,
    code: item.code,
    name: item.name ?? item.title ?? '',
    bcCode: item.bcCode,
    nepaCode: item.nepaCode,
    cobraNotice: isNotice,
    actionCode: item.actionCode,
    cobraTerm:
      coverageMonthNum === 18
        ? '18months'
        : coverageMonthNum === 36
          ? '36months'
          : coverageMonthNum > 0
            ? 'non-standard'
            : '18months',
    cobraMonths: coverageMonthNum,
    coverageMonth: coverageMonthNum,
  }
}



function getPaginationResult(
  items: TerminationCode[],
  request: PaginationRequest,
  response?: TerminationCodePaginatedListResponse,
): PaginatedResult<TerminationCode> {
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

export async function createTerminationCodeApi(
  data: CreateTerminationCodeRequest,
): Promise<{ id: string }> {
  const response = await apiClient.post<{ id: string }>(
    '/api/v1/termination-codes',
    data,
  )

  return response.data
}

export async function getTerminationCodesApi(
  request: PaginationRequest,
  search?: string,
): Promise<PaginatedResult<TerminationCode>> {
  const { data } = await apiClient.get<TerminationCodeListResponse>(
    '/api/v1/termination-codes',
    {
      params: {
        page: request.pageIndex + 1,
        pageSize: request.pageSize,
        search: search?.trim() || undefined,
      },
    },
  )

  if (Array.isArray(data)) {
    return getPaginationResult(data.map(mapTerminationCode), request)
  }

  return getPaginationResult(
    (
      data.data ??
      data.terminationCodes ??
      data.items ??
      data.results ??
      []
    ).map(mapTerminationCode),
    request,
    data,
  )
}

export async function getTerminationCodeByIdApi(
  id: string,
): Promise<TerminationCodeApiItem> {
  const { data } = await apiClient.get<TerminationCodeApiItem>(
    `/api/v1/termination-codes/${id}`,
  )

  return data
}

export async function updateTerminationCodeApi(
  id: string,
  data: CreateTerminationCodeRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/termination-codes/${id}`, data)
}

export async function deleteTerminationCodeApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/termination-codes/${id}`)
}
