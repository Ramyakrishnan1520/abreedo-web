import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { Carrier } from '#/types/carrier.ts'

interface CarrierTableColumnActions {
  onEdit: (carrier: Carrier) => void
  onDelete: (carrier: Carrier) => void
}

const { table: tableCopy } = CARRIER_CONTENT

function displayValue(value: string) {
  return value.trim() || tableCopy.emptyValue
}

export function getCarrierTableColumns({
  onEdit,
  onDelete,
}: CarrierTableColumnActions): ColumnDef<Carrier>[] {
  return [
    {
      accessorKey: 'name',
      header: tableCopy.columns.name,
      cell: ({ row }) => displayValue(row.original.name),
    },
    {
      accessorKey: 'groupTitle',
      header: tableCopy.columns.groupTitle,
      cell: ({ row }) => displayValue(row.original.groupTitle),
    },
    {
      accessorKey: 'phone',
      header: tableCopy.columns.phone,
      cell: ({ row }) => displayValue(row.original.phone),
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
