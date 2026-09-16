import type { ReactNode } from 'react'
import type {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  Row,
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
  expanded?: ExpandedState
  onExpandedChange?: OnChangeFn<ExpandedState>
  getRowCanExpand?: (row: Row<TData>) => boolean
  renderExpandedRow?: (row: Row<TData>) => ReactNode
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
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
