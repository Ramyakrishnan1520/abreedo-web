import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'

import type { ColumnDef } from '@tanstack/react-table'
import type { Carrier } from '#/types/carrier.ts'

interface CarrierTableColumnActions {
  onEdit: (carrier: Carrier) => void
  onDelete: (carrier: Carrier) => void
}

function displayValue(value: string) {
  return value.trim() || '-'
}

export function getCarrierTableColumns({
  onEdit,
  onDelete,
}: CarrierTableColumnActions): ColumnDef<Carrier>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => displayValue(row.original.name),
    },
    {
      accessorKey: 'groupTitle',
      header: 'Group Title',
      cell: ({ row }) => displayValue(row.original.groupTitle),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => displayValue(row.original.phone),
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
          variant="destructive"
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
