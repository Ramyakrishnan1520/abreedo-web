import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { Employer } from '#/types/employer.ts'

interface EmployerTableColumnActions {
  onView?: (employer: Employer) => void
  onEdit?: (employer: Employer) => void
  onDelete?: (employer: Employer) => void
}

const { table: tableCopy } = EMPLOYER_CONTENT

function displayValue(value: string) {
  return value.trim() || tableCopy.emptyValue
}

export function getEmployerTableColumns({
  onView,
  onEdit,
  onDelete,
}: EmployerTableColumnActions): ColumnDef<Employer>[] {
  const columns: ColumnDef<Employer>[] = [
    {
      accessorKey: 'name',
      header: tableCopy.columns.name,
      cell: ({ row }) => displayValue(row.original.name),
    },
    {
      accessorKey: 'parentCompanyName',
      header: tableCopy.columns.parentCompany,
      cell: ({ row }) => displayValue(row.original.parentCompanyName),
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
