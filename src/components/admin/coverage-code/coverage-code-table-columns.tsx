import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { CoverageCode } from '#/types/coverage-code.ts'

interface CoverageCodeTableColumnActions {
  onView?: (coverageCode: CoverageCode) => void
  onEdit?: (coverageCode: CoverageCode) => void
  onDelete?: (coverageCode: CoverageCode) => void
}

const { table: tableCopy } = COVERAGE_CODE_CONTENT

function displayValue(value: string) {
  return value.trim() || tableCopy.emptyValue
}

export function getCoverageCodeTableColumns({
  onView,
  onEdit,
  onDelete,
}: CoverageCodeTableColumnActions): ColumnDef<CoverageCode>[] {
  const columns: ColumnDef<CoverageCode>[] = [
    {
      accessorKey: 'code',
      header: tableCopy.columns.code,
      cell: ({ row }) => displayValue(row.original.code),
    },
    {
      accessorKey: 'description',
      header: tableCopy.columns.name,
      cell: ({ row }) =>
        displayValue(row.original.name || row.original.description),
    },
    {
      accessorKey: 'carrierName',
      header: tableCopy.columns.carrier,
      cell: ({ row }) => displayValue(row.original.carrierName ?? ''),
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
          aria-label={tableCopy.viewAria(row.original.code)}
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
          aria-label={tableCopy.editAria(row.original.code)}
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
          aria-label={tableCopy.deleteAria(row.original.code)}
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    })
  }

  return columns
}
