import { Eye, Pencil } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { Plan } from '#/types/plan.ts'

interface PlanTableColumnActions {
  onView?: (plan: Plan) => void
  onEdit?: (plan: Plan) => void
}

const { table: tableCopy } = PLAN_CONTENT

function displayValue(value?: string | null) {
  return value && value.trim() ? value : tableCopy.emptyValue
}

export function getPlanTableColumns({
  onView,
  onEdit,
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
      accessorKey: 'option',
      header: tableCopy.columns.option,
      cell: ({ row }) => displayValue(row.original.option),
    },
    {
      accessorKey: 'coverageCodeTitle',
      header: tableCopy.columns.coverageCode,
      cell: ({ row }) => displayValue(row.original.coverageCodeTitle),
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

  return columns
}
