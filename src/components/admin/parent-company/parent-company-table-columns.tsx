import { Eye, Pencil } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'

import type { ColumnDef } from '@tanstack/react-table'
import type { ParentCompany } from '#/types/parent-company.ts'

interface ParentCompanyTableColumnActions {
  onView?: (parentCompany: ParentCompany) => void
  onEdit?: (parentCompany: ParentCompany) => void
}

const { table: tableCopy } = PARENT_COMPANY_CONTENT

function displayValue(value: string) {
  return value.trim() || tableCopy.emptyValue
}

export function getParentCompanyTableColumns({
  onView,
  onEdit,
}: ParentCompanyTableColumnActions): ColumnDef<ParentCompany>[] {
  const columns: ColumnDef<ParentCompany>[] = [
    {
      accessorKey: 'name',
      header: tableCopy.columns.name,
      cell: ({ row }) => displayValue(row.original.name),
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
