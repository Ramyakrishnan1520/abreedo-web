import { Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import { cn } from '#/lib/utils.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

const copy = EMPLOYER_CONTENT.planStep

export interface EmployerPlanTableProps {
  planName?: string
  groupNumber?: string
  billerAccountNumber?: string
  customerNumber?: string
  brokerCodeName?: string
  isActive?: boolean
  isSelected?: boolean
  onRowClick?: () => void
  onDelete?: (e: React.MouseEvent) => void
  className?: string
}

export function EmployerPlanTable({
  planName,
  groupNumber,
  billerAccountNumber,
  customerNumber,
  brokerCodeName,
  isActive = true,
  isSelected = false,
  onRowClick,
  onDelete,
  className,
}: EmployerPlanTableProps) {
  const showAction = Boolean(onDelete)
  const isClickable = Boolean(onRowClick)

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <Table className="w-full text-left text-sm text-slate-700">
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/75">
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.plan}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.groupNumber}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.billerAccount}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.customerNumber}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.brokerCode}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.status}
              </TableHead>
              {showAction ? (
                <TableHead className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  {copy.tableColumns.action}
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            <TableRow
              onClick={onRowClick}
              className={cn(
                isClickable &&
                  'cursor-pointer transition-colors hover:bg-slate-50/80',
                isSelected &&
                  'bg-tan-light/30 ring-1 ring-tan-accent/40 hover:bg-tan-light/40',
              )}
            >
              <TableCell className="px-4 py-3.5 font-medium text-slate-900">
                {planName || '-'}
              </TableCell>
              <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                {groupNumber || '-'}
              </TableCell>
              <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                {billerAccountNumber || '-'}
              </TableCell>
              <TableCell className="px-4 py-3.5 text-slate-600">
                {customerNumber || '-'}
              </TableCell>
              <TableCell className="px-4 py-3.5 text-slate-600">
                {brokerCodeName || '-'}
              </TableCell>
              <TableCell className="px-4 py-3.5">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                      : 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20'
                  }`}
                >
                  {isActive ? copy.activeStatus : copy.inactiveStatus}
                </span>
              </TableCell>
              {showAction ? (
                <TableCell
                  className="px-4 py-3.5 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(e)
                    }}
                    className="text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={copy.deleteAria}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              ) : null}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
