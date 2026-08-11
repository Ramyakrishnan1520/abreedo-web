import { apiClient } from '#/api/api-client.ts'

import type {
  Employer,
  EmployerApiItem,
  EmployerListResponse,
  EmployerPaginatedListResponse,
} from '#/types/employer.ts'
import type {
  PaginatedResult,
  PaginationRequest,
} from '#/types/pagination.ts'

function mapEmployer(item: EmployerApiItem): Employer {
  return {
    id: item.employerId,
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
): Promise<PaginatedResult<Employer>> {
  const params: Record<string, string | number> = {
    Page: request.pageIndex + 1,
    PageSize: request.pageSize,
  }

  if (parentCompanyId) {
    params.parentCompanyId = parentCompanyId
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
