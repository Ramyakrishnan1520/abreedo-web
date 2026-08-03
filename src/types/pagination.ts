export interface PaginatedResult<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface PaginationRequest {
  pageIndex: number
  pageSize: number
}
