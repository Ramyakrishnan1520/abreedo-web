import { useMemo, useState } from 'react'

import { ReusableTable } from '#/components/table'
import { getUserTableColumns } from '#/components/admin/user-table-columns.tsx'
import { users } from '#/data/users.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { User } from '#/types/user.ts'

export function UsersPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = useMemo(
    () =>
      getUserTableColumns({
        onEdit: (user: User) => {
          console.log('Edit user', user.id)
        },
        onDelete: (user: User) => {
          console.log('Delete user', user.id)
        },
      }),
    [],
  )

  return (
    <main className="page-wrap py-8">
      <div className="mb-6">
        <p className="island-kicker">Users</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          Users table
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Manage admin portal users with quick edit and delete actions.
        </p>
      </div>

      <ReusableTable
        data={users}
        columns={columns}
        loading={false}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </main>
  )
}
