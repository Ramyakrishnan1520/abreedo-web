import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { TableLoading } from './table-loading.tsx'
import { TablePagination } from './table-pagination.tsx'

import type { ReusableTableProps } from '#/types/table.ts'

export function ReusableTable<TData>({
  data,
  columns,
  loading,
  pagination,
  onPaginationChange,
  pageCount,
  rowCount,
}: ReusableTableProps<TData>) {
  const usesServerPagination = pageCount !== undefined || rowCount !== undefined

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange,
    pageCount,
    rowCount,
    manualPagination: usesServerPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: usesServerPagination
      ? undefined
      : getPaginationRowModel(),
  })

  const visibleColumns = Math.max(table.getVisibleLeafColumns().length, 1)
  const rows = table.getRowModel().rows

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-900 whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoading colSpan={visibleColumns} />
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3.5 align-middle text-sm text-slate-600"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns}
                  className="px-4 py-12 text-center text-sm font-medium text-slate-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        table={table}
        loading={loading}
        pageCount={pageCount}
        rowCount={rowCount}
      />
    </div>
  )
}
