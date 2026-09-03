import { apiClient } from '#/api/api-client.ts'

import type {
  BrokerCode,
  BrokerCodeDto,
  BrokerCodeDtoPagedResult,
  GetBrokerCodesQueryParams,
} from '#/types/broker-code.ts'
import type { PaginatedResult, PaginationRequest } from '#/types/pagination.ts'

function mapBrokerCode(item: BrokerCodeDto): BrokerCode {
  return {
    id: item.brokerCodeId,
    code: item.code ?? '',
    name: item.name ?? item.code ?? '',
    reportCode: item.reportCode ?? null,
    superParentCompanyId: item.superParentCompanyId ?? null,
    parentCompanyId: item.parentCompanyId ?? null,
  }
}

function getPaginationResult(
  items: BrokerCode[],
  request: PaginationRequest,
  response?: BrokerCodeDtoPagedResult,
): PaginatedResult<BrokerCode> {
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

export async function getBrokerCodesApi(
  params: GetBrokerCodesQueryParams,
): Promise<PaginatedResult<BrokerCode>> {
  const queryParams: Record<string, string | number> = {
    Page: params.pageIndex + 1,
    PageSize: params.pageSize,
  }

  if (params.search && params.search.trim() !== '') {
    queryParams.Search = params.search.trim()
  }

  if (params.sort && params.sort.trim() !== '') {
    queryParams.Sort = params.sort.trim()
  }

  const { data } = await apiClient.get<BrokerCodeDtoPagedResult | BrokerCodeDto[]>(
    '/api/v1/broker-codes',
    {
      params: queryParams,
    },
  )

  const request: PaginationRequest = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  }

  if (Array.isArray(data)) {
    return getPaginationResult(data.map(mapBrokerCode), request)
  }

  const items = (data.items ?? []).map(mapBrokerCode)

  return getPaginationResult(items, request, data)
}
