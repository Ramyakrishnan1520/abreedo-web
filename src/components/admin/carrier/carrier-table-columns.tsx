import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { Carrier } from '#/types/carrier.ts'

interface CarrierTableColumnActions {
  onView?: (carrier: Carrier) => void
  onEdit?: (carrier: Carrier) => void
  onDelete?: (carrier: Carrier) => void
}

const { table: tableCopy } = CARRIER_CONTENT

function displayValue(value: string) {
  return value.trim() || tableCopy.emptyValue
}

export function getCarrierTableColumns({
  onView,
  onEdit,
  onDelete,
}: CarrierTableColumnActions): ColumnDef<Carrier>[] {
  const columns: ColumnDef<Carrier>[] = [
    {
      accessorKey: 'name',
      header: tableCopy.columns.name,
      cell: ({ row }) => displayValue(row.original.name),
    },
    {
      accessorKey: 'contactName',
      header: tableCopy.columns.contactName,
      cell: ({ row }) =>
        displayValue(row.original.contactName || row.original.contactFirst || ''),
    },
    {
      accessorKey: 'email',
      header: tableCopy.columns.email,
      cell: ({ row }) => displayValue(row.original.email || ''),
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

