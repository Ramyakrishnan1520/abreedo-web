import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { Employer } from '#/types/employer.ts'

interface EmployerTableColumnActions {
  onEdit: (employer: Employer) => void
  onDelete: (employer: Employer) => void
}

const { table: tableCopy } = EMPLOYER_CONTENT

function displayValue(value: string) {
  return value.trim() || tableCopy.emptyValue
}

export function getEmployerTableColumns({
  onEdit,
  onDelete,
}: EmployerTableColumnActions): ColumnDef<Employer>[] {
  return [
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
