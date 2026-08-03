import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

import type { ColumnDef } from '@tanstack/react-table'
import type { CoverageCode } from '#/types/coverage-code.ts'

interface CoverageCodeTableColumnActions {
  onEdit: (coverageCode: CoverageCode) => void
  onDelete: (coverageCode: CoverageCode) => void
}

function displayValue(value: string) {
  return value.trim() || '-'
}

export function getCoverageCodeTableColumns({
  onEdit,
  onDelete,
}: CoverageCodeTableColumnActions): ColumnDef<CoverageCode>[] {
  return [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => displayValue(row.original.code),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => displayValue(row.original.description),
    },
    {
      id: 'edit',
      header: 'Edit',
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Edit ${row.original.code}`}
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="size-4" />
        </Button>
      ),
    },
    {
      id: 'delete',
      header: 'Delete',
      cell: ({ row }) => (
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          aria-label={`Delete ${row.original.code}`}
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    },
  ]
}
