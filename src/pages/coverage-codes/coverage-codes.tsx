import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { getCoverageCodeTableColumns } from '#/components/admin/coverage-code/coverage-code-table-columns'
import { ReusableTable } from '#/components/table'
import { Button } from '#/components/ui/button.tsx'
import { useCoverageCodes } from '#/hooks/coverage-code/use-coverage-codes'

import type { PaginationState } from '@tanstack/react-table'
import type { CoverageCode } from '#/types/coverage-code.ts'
import { ROUTES } from '#/static/routes.ts'

export function CoverageCodesPage() {
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const {
    data: coverageCodesResult,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useCoverageCodes(pagination)
  const coverageCodes = coverageCodesResult?.items ?? []

  const columns = useMemo(
    () =>
      getCoverageCodeTableColumns({
        onEdit: (coverageCode: CoverageCode) => {
          console.log('Edit coverage code', coverageCode.id)
        },
        onDelete: (coverageCode: CoverageCode) => {
          console.log('Delete coverage code', coverageCode.id)
        },
      }),
    [],
  )

  return (
    <main className="page-wrap py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="island-kicker">Site Manager</p>
          <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
            Coverage Codes
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage coverage code records and pricing rules with reusable TanStack
            Table columns, server-side pagination, and action controls.
          </p>
        </div>
        <div>
          <Button
            id="new-coverage-code-btn"
            type="button"
            onClick={() => void navigate({ to: ROUTES.ADMIN_COVERAGE_CODES_NEW })}
            className="bg-tan-dark hover:bg-tan-dark/90 text-white rounded-md px-6 h-9 font-semibold shadow-xs transition-colors cursor-pointer"
          >
            New Coverage Code
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {error instanceof Error
                ? error.message
                : 'Unable to load coverage codes. Please try again.'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      <ReusableTable
        data={coverageCodes}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={coverageCodesResult?.totalPages}
        rowCount={coverageCodesResult?.totalCount ?? 0}
      />
    </main>
  )
}


