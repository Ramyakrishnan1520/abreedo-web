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

import type { PlanRateFormItem } from '#/components/admin/employer/employer.schema.ts'
import type { PlanRateItem } from '#/types/employer.ts'

const copy = EMPLOYER_CONTENT.rateStep

export function formatEmployerRateDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const raw = dateStr.split('T')[0]
    const parts = raw.split('-')
    if (parts.length === 3) {
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      return `${month}/${day}/${year}`
    }
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  } catch {
    return dateStr
  }
}

export function formatEmployerRateCurrency(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === '') return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

export interface EmployerRatesTableProps<
  T extends (PlanRateFormItem | PlanRateItem) & { planName?: string } = (PlanRateFormItem | PlanRateItem) & { planName?: string },
> {
  rates: T[]
  showPlanName?: boolean
  selectedIndex?: number | null
  onRowClick?: (rate: T, index: number) => void
  onDelete?: (index: number, e: React.MouseEvent) => void
  className?: string
}

export function EmployerRatesTable<
  T extends (PlanRateFormItem | PlanRateItem) & { planName?: string } = (PlanRateFormItem | PlanRateItem) & { planName?: string },
>({
  rates,
  showPlanName = false,
  selectedIndex = null,
  onRowClick,
  onDelete,
  className,
}: EmployerRatesTableProps<T>) {
  const showAction = Boolean(onDelete)
  const isClickable = Boolean(onRowClick)

  if (rates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
        {copy.emptyTable}
      </div>
    )
  }

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
              {showPlanName ? (
                <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  {copy.tableColumns.plan}
                </TableHead>
              ) : null}
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.effectiveDate}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.individual}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.parentChild}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.parentChildren}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.memberSpouse}
              </TableHead>
              <TableHead className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {copy.tableColumns.family}
              </TableHead>
              {showAction ? (
                <TableHead className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  {copy.tableColumns.action}
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {rates.map((rate, index) => {
              const isRowSelected = selectedIndex === index

              return (
                <TableRow
                  key={rate.id || rate.planRateId || `${rate.effectiveDate}-${index}`}
                  onClick={onRowClick ? () => onRowClick(rate, index) : undefined}
                  className={cn(
                    isClickable &&
                      'cursor-pointer transition-colors hover:bg-slate-50/80',
                    isRowSelected &&
                      'bg-tan-light/30 ring-1 ring-tan-accent/40 hover:bg-tan-light/40',
                  )}
                >
                  {showPlanName ? (
                    <TableCell className="px-4 py-3.5 font-medium text-slate-900">
                      {rate.planName || '-'}
                    </TableCell>
                  ) : null}
                  <TableCell className="px-4 py-3.5 font-medium text-slate-900">
                    {formatEmployerRateDate(rate.effectiveDate)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                    {formatEmployerRateCurrency(rate.individual)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                    {formatEmployerRateCurrency(rate.parentChild)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                    {formatEmployerRateCurrency(rate.parentChildren)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                    {formatEmployerRateCurrency(rate.husbandWife)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                    {formatEmployerRateCurrency(rate.family)}
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
                          onDelete?.(index, e)
                        }}
                        className="text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        aria-label={copy.deleteAria}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
