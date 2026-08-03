import { Button } from '#/components/ui/button.tsx'
import { PAGE_SIZE_OPTIONS } from '#/utils/table.ts'

import type { TablePaginationProps } from '#/types/table.ts'

export function TablePagination<TData>({
  table,
  loading = false,
  pageCount,
  rowCount,
}: TablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const totalEntries = rowCount ?? table.getPrePaginationRowModel().rows.length
  const totalPages = Math.max(pageCount ?? table.getPageCount(), 1)
  const firstEntry = totalEntries === 0 ? 0 : pageIndex * pageSize + 1
  const lastEntry = Math.min((pageIndex + 1) * pageSize, totalEntries)

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-600">
        Showing {firstEntry} to {lastEntry} of {totalEntries} entries
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
          Rows per page
          <select
            value={pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            disabled={loading}
            className="h-8 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm font-medium text-slate-700 shadow-xs outline-none focus:border-tan-dark focus:ring-1 focus:ring-tan-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={loading || !table.getCanPreviousPage()}
            className="h-8 rounded-md border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs"
          >
            Previous
          </Button>
          <span className="min-w-24 text-center text-xs font-semibold text-slate-600">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={loading || !table.getCanNextPage()}
            className="h-8 rounded-md border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
