import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  Table,
} from '@tanstack/react-table'

export interface ReusableTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  loading: boolean
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  pageCount?: number
  rowCount?: number
}

export interface TablePaginationProps<TData> {
  table: Table<TData>
  loading?: boolean
  pageCount?: number
  rowCount?: number
}

export interface TableLoadingProps {
  colSpan: number
  rows?: number
}
