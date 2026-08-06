import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { Plan } from '#/types/plan.ts'

interface PlanTableColumnActions {
  onEdit: (plan: Plan) => void
  onDelete: (plan: Plan) => void
}

const { table: tableCopy } = PLAN_CONTENT

function displayValue(value: string) {
  return value.trim() ? value : tableCopy.emptyValue
}

export function getPlanTableColumns({
  onEdit,
  onDelete,
}: PlanTableColumnActions): ColumnDef<Plan>[] {
  return [
    {
      accessorKey: 'name',
      header: tableCopy.columns.name,
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">
          {displayValue(row.original.name)}
        </span>
      ),
    },
    {
      accessorKey: 'code',
      header: tableCopy.columns.code,
      cell: ({ row }) => displayValue(row.original.code),
    },
    {
      accessorKey: 'coverageCodeTitle',
      header: tableCopy.columns.coverageCode,
      cell: ({ row }) => displayValue(row.original.coverageCodeTitle),
    },
    {
      accessorKey: 'option',
      header: tableCopy.columns.option,
      cell: ({ row }) => displayValue(row.original.option),
    },
    {
      accessorKey: 'effectiveDate',
      header: tableCopy.columns.effectiveDate,
      cell: ({ row }) => displayValue(row.original.effectiveDate),
    },
    {
      id: 'edit',
      header: tableCopy.columns.edit,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={tableCopy.editAria(row.original.name)}
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="size-4" />
        </Button>
      ),
    },
    {
      id: 'delete',
      header: tableCopy.columns.delete,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          aria-label={tableCopy.deleteAria(row.original.name)}
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    },
  ]
}
