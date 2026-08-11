import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { getCoverageCodeTableColumns } from '#/components/admin/coverage-code/coverage-code-table-columns'
import { ReusableTable } from '#/components/table'
import { Button } from '#/components/ui/button.tsx'
import { useCoverageCodes } from '#/hooks/coverage-code/use-coverage-codes'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { ROUTES } from '#/static/routes.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { CoverageCode } from '#/types/coverage-code.ts'

const copy = COVERAGE_CODE_CONTENT.list

export function CoverageCodesPage() {
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

  const navigate = useNavigate()
  const columns = useMemo(
    () =>
      getCoverageCodeTableColumns({
        onEdit: (_coverageCode: CoverageCode) => {
          navigate({ to: ROUTES.ADMIN_COVERAGE_CODES_EDIT })
        },
        onDelete: (coverageCode: CoverageCode) => {
          console.log('Delete coverage code', coverageCode.id)
        },
      }),
    [navigate],
  )

  return (
    <main className="page-wrap py-8">
      <div className="mb-6">
        <p className="island-kicker">{copy.kicker}</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">{copy.description}</p>
      </div>

      {isError ? (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {error instanceof Error ? error.message : copy.loadErrorFallback}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {copy.retry}
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
