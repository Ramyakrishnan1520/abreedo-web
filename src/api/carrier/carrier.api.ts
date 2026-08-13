import { apiClient } from '#/api/api-client.ts'

import type {
  Carrier,
  CarrierApiItem,
  CarrierListResponse,
  CarrierPaginatedListResponse,
  CreateCarrierRequest,
  CreateCarrierResponse,
  GetStatesResponse,
} from '#/types/carrier.ts'
import type {
  PaginatedResult,
  PaginationRequest,
} from '#/types/pagination.ts'

function mapCarrier(item: CarrierApiItem): Carrier {
  return {
    id: item.carrierId,
    name: item.name,
    groupTitle: item.groupNumber,
    phone: item.phone,
  }
}

function getPaginationResult(
  items: Carrier[],
  request: PaginationRequest,
  response?: CarrierPaginatedListResponse,
): PaginatedResult<Carrier> {
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

export async function createCarrierApi(
  data: CreateCarrierRequest,
): Promise<CreateCarrierResponse> {
  const response = await apiClient.post<CreateCarrierResponse>(
    '/api/v1/carriers',
    data,
  )

  return response.data
}

export async function getStatesApi(): Promise<GetStatesResponse> {
  const response = await apiClient.get<GetStatesResponse>('/api/v1/States')

  return response.data
}

export async function getCarriersApi(
  request: PaginationRequest,
  search?: string,
): Promise<PaginatedResult<Carrier>> {
  const { data } = await apiClient.get<CarrierListResponse>('/api/v1/carriers', {
    params: {
      page: request.pageIndex + 1,
      pageSize: request.pageSize,
      search: search?.trim() || undefined,
    },
  })

  if (Array.isArray(data)) {
    return getPaginationResult(data.map(mapCarrier), request)
  }

  return getPaginationResult(
    (data.data ?? data.carriers ?? data.items ?? data.results ?? []).map(
      mapCarrier,
    ),
    request,
    data,
  )
}

export async function getCarrierByIdApi(id: string): Promise<CarrierApiItem> {
  const { data } = await apiClient.get<CarrierApiItem>(
    `/api/v1/Carriers/${id}`,
  )

  return data
}

export async function updateCarrierApi(
  id: string,
  data: CreateCarrierRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/Carriers/${id}`, data)
}

export async function deleteCarrierApi(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/Carriers/${id}`)
}



