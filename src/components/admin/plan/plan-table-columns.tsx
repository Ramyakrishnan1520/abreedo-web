import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { Plan } from '#/types/plan.ts'

interface PlanTableColumnActions {
  onView?: (plan: Plan) => void
  onEdit?: (plan: Plan) => void
  onDelete?: (plan: Plan) => void
}

const { table: tableCopy } = PLAN_CONTENT

function displayValue(value?: string | null) {
  return value && value.trim() ? value : tableCopy.emptyValue
}

export function getPlanTableColumns({
  onView,
  onEdit,
  onDelete,
}: PlanTableColumnActions): ColumnDef<Plan>[] {
  const columns: ColumnDef<Plan>[] = [
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
  ]

  if (onView) {
    columns.push({
      id: 'view',
      header: tableCopy.columns.view,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={tableCopy.viewAria(row.original.name)}
          onClick={() => onView(row.original)}
        >
          <Eye className="size-4" />
        </Button>
      ),
    })
  }

  if (onEdit) {
    columns.push({
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
    })
  }

  if (onDelete) {
    columns.push({
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
    })
  }

  return columns
}
