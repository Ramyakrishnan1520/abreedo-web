import type { TableLoadingProps } from '#/types/table.ts'

export function TableLoading({ colSpan, rows = 5 }: TableLoadingProps) {
  return Array.from({ length: rows }, (_, index) => (
    <tr key={index} className="border-b border-slate-100 last:border-b-0">
      <td colSpan={colSpan} className="px-4 py-4">
        <div className="h-4 w-full max-w-[720px] animate-pulse rounded-md bg-slate-200/60" />
      </td>
    </tr>
  ))
}
