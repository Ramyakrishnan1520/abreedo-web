import { Fragment, useState } from 'react'
import { ChevronRight, Pencil, Trash2 } from 'lucide-react'

import { EmployerRatesTable } from '#/components/admin/employer/EmployerRatesTable.tsx'
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

import type { ConfiguredEmployerPlan } from '#/components/admin/employer/employer.schema.ts'

const copy = EMPLOYER_CONTENT.planStep

export interface EmployerPlanTableProps {
  plans?: ConfiguredEmployerPlan[]
  expandable?: boolean
  // Single plan fallback props
  planName?: string
  groupNumber?: string
  billerAccountNumber?: string
  customerNumber?: string
  brokerCodeName?: string
  isActive?: boolean
  isSelected?: boolean
  selectedIndex?: number | null
  onRowClick?: ((plan: ConfiguredEmployerPlan, index: number) => void) | (() => void)
  onEdit?: (plan: ConfiguredEmployerPlan, index: number, e: React.MouseEvent) => void
  onDelete?: ((index: number, e: React.MouseEvent) => void) | ((e: React.MouseEvent) => void)
  className?: string
}

export function EmployerPlanTable({
  plans,
  expandable = false,
  planName,
  groupNumber,
  billerAccountNumber,
  customerNumber,
  brokerCodeName,
  isActive = true,
  isSelected = false,
  selectedIndex = null,
  onRowClick,
  onEdit,
  onDelete,
  className,
}: EmployerPlanTableProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set())

  const toggleRowExpand = (index: number) => {
    if (!expandable) return
    setExpandedIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  // Normalize items array
  const planItems: ConfiguredEmployerPlan[] = plans ?? (planName || groupNumber ? [
    {
      planId: '',
      planName: planName || '',
      cgnGroupNumber: groupNumber || '',
      billerAccountNumber: billerAccountNumber || '',
      cgnCustomerNumber: customerNumber || '',
      brokerCodeId: '',
      brokerCodeName: brokerCodeName || '',
      isActive,
      rates: [],
    },
  ] : [])

  if (planItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
        {copy.emptyTable}
      </div>
    )
  }

  const showAction = Boolean(onDelete || onEdit)
  const isClickable = Boolean(onRowClick || onEdit)

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
              {expandable ? <TableHead className="w-10 px-3 py-3" /> : null}
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
            {planItems.map((item, index) => {
              const rowSelected = selectedIndex === index || (isSelected && index === 0)
              const activeStatus = item.isActive ?? true
              const isExpanded = expandable && expandedIndexes.has(index)

              return (
                <Fragment key={item.id || `${item.planId}-${item.cgnGroupNumber}-${index}`}>
                  <TableRow
                    onClick={(e) => {
                      if (expandable) {
                        toggleRowExpand(index)
                      }
                      if (onRowClick) {
                        (onRowClick as (plan: ConfiguredEmployerPlan, idx: number) => void)(item, index)
                      } else if (onEdit && !expandable) {
                        onEdit(item, index, e)
                      }
                    }}
                    className={cn(
                      isClickable || expandable ? 'cursor-pointer transition-colors hover:bg-slate-50/80' : '',
                      rowSelected &&
                        'bg-tan-light/30 ring-1 ring-tan-accent/40 hover:bg-tan-light/40',
                      isExpanded && 'bg-slate-50/50',
                    )}
                  >
                    {expandable ? (
                      <TableCell className="w-10 px-3 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRowExpand(index)
                          }}
                          className="inline-flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-transform cursor-pointer"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? copy.collapseRatesAria : copy.expandRatesAria}
                        >
                          <ChevronRight
                            className={cn(
                              'size-4 transition-transform duration-200',
                              isExpanded && 'rotate-90 text-tan-dark',
                            )}
                          />
                        </button>
                      </TableCell>
                    ) : null}
                    <TableCell className="px-4 py-3.5 font-medium text-slate-900">
                      {item.planName || item.planId || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                      {item.cgnGroupNumber || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                      {item.billerAccountNumber || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-slate-600">
                      {item.cgnCustomerNumber || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-slate-600">
                      {item.brokerCodeName || item.brokerCodeId || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          activeStatus
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20'
                        }`}
                      >
                        {activeStatus ? copy.activeStatus : copy.inactiveStatus}
                      </span>
                    </TableCell>
                    {showAction ? (
                      <TableCell
                        className="px-4 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {onEdit ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEdit(item, index, e)
                              }}
                              className="text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                              aria-label="Edit plan"
                            >
                              <Pencil className="size-4" />
                            </Button>
                          ) : null}
                          {onDelete ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (plans) {
                                  (onDelete as (idx: number, ev: React.MouseEvent) => void)(index, e)
                                } else {
                                  (onDelete as (ev: React.MouseEvent) => void)(e)
                                }
                              }}
                              className="text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                              aria-label={copy.deleteAria}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>

                  {/* Expandable Nested Rates Row (only when expandable={true}) */}
                  {expandable && isExpanded ? (
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
                      <TableCell colSpan={showAction ? 8 : 7} className="p-3 pl-12 sm:pl-14">
                        {item.rates && item.rates.length > 0 ? (
                          <EmployerRatesTable
                            rates={item.rates}
                            className="border-slate-200/80 bg-white shadow-none"
                          />
                        ) : (
                          <p className="py-2 text-xs italic text-slate-400">
                            {copy.noRatesForPlan}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
