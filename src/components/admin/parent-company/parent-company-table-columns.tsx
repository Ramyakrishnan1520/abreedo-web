import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

import type { ColumnDef } from '@tanstack/react-table'
import type { ParentCompany } from '#/types/parent-company.ts'

interface ParentCompanyTableColumnActions {
  onEdit: (parentCompany: ParentCompany) => void
  onDelete: (parentCompany: ParentCompany) => void
}

function displayValue(value: string) {
  return value.trim() || '-'
}

export function getParentCompanyTableColumns({
  onEdit,
  onDelete,
}: ParentCompanyTableColumnActions): ColumnDef<ParentCompany>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => displayValue(row.original.name),
    },
    {
      accessorKey: 'contactName',
      header: 'Contact',
      cell: ({ row }) => displayValue(row.original.contactName),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => displayValue(row.original.phone),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => displayValue(row.original.email),
    },
    {
      id: 'edit',
      header: 'Edit',
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Edit ${row.original.name}`}
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
          variant="outline"
          size="icon-sm"
          aria-label={`Delete ${row.original.name}`}
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    },
  ]
}
