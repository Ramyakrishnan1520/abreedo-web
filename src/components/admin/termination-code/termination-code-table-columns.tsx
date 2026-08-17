import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { TerminationCode } from '#/types/termination-code.ts'

interface TerminationCodeTableColumnActions {
  onView?: (item: TerminationCode) => void
  onEdit?: (item: TerminationCode) => void
  onDelete?: (item: TerminationCode) => void
}

const { table: tableCopy } = TERMINATION_CODE_CONTENT

function displayValue(value: string | number | undefined | null) {
  if (value === undefined || value === null) return tableCopy.emptyValue
  const str = String(value).trim()
  return str || tableCopy.emptyValue
}

function formatCobraNotice(actionCode?: number, cobraNotice?: boolean): string {
  if (actionCode === 1 || cobraNotice === true) return 'Yes'
  if (actionCode === 2 || cobraNotice === false) return 'No'
  return tableCopy.emptyValue
}

function formatCobraTerm(
  term?: string,
  months?: number | string,
  actionCode?: number,
  cobraNotice?: boolean,
): string {
  if (actionCode === 2 || cobraNotice === false) return tableCopy.emptyValue
  if (term === '18months') return '18 Months'
  if (term === '36months') return '36 Months'
  if (term === 'non-standard') {
    return months ? `${months} Months` : 'Non-Standard'
  }
  if (term) return term
  if (months !== undefined && months !== null && String(months).trim() !== '' && String(months) !== '0') {
    return `${months} Months`
  }
  return tableCopy.emptyValue
}

export function getTerminationCodeTableColumns({
  onView,
  onEdit,
  onDelete,
}: TerminationCodeTableColumnActions): ColumnDef<TerminationCode>[] {
  const columns: ColumnDef<TerminationCode>[] = [
    {
      accessorKey: 'name',
      header: tableCopy.columns.name,
      cell: ({ row }) => displayValue(row.original.name || row.original.code),
    },
    {
      accessorKey: 'cobraTerm',
      header: tableCopy.columns.cobraTerm,
      cell: ({ row }) =>
        formatCobraTerm(
          row.original.cobraTerm,
          row.original.coverageMonths ?? row.original.cobraMonths,
          row.original.actionCode,
          row.original.cobraNotice,
        ),
    },
    {
      accessorKey: 'actionCode',
      header: tableCopy.columns.cobraNotice,
      cell: ({ row }) =>
        formatCobraNotice(row.original.actionCode, row.original.cobraNotice),
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
          aria-label={tableCopy.viewAria(row.original.name || row.original.code)}
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
          aria-label={tableCopy.editAria(row.original.name || row.original.code)}
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
          aria-label={tableCopy.deleteAria(row.original.name || row.original.code)}
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    })
  }

  return columns
}
