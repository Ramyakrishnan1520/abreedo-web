import { Button } from '#/components/ui/button.tsx'

import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '#/types/user.ts'

interface UserTableColumnActions {
  onEdit: (user: User) => void
}

export function getUserTableColumns({
  onEdit,
}: UserTableColumnActions): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'login',
      header: 'Login',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      id: 'edit',
      header: 'Edit',
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
        >
          Edit
        </Button>
      ),
    },
  ]
}
