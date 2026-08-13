import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { getEmployerTableColumns } from '#/components/admin/employer/employer-table-columns.tsx'
import { ParentCompanySearchSelect } from '#/components/admin/parent-company/ParentCompanySearchSelect.tsx'
import { ReusableTable } from '#/components/table'
import { Button } from '#/components/ui/button.tsx'
import { useEmployers } from '#/hooks/employer/use-employers.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { ROUTES } from '#/static/routes.ts'

import type { PaginationState } from '@tanstack/react-table'
import type { Employer } from '#/types/employer.ts'

const copy = EMPLOYER_CONTENT.list

export function EmployersListPage() {
  const [selectedParentCompanyId, setSelectedParentCompanyId] = useState<
    string | undefined
  >()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: parentCompanies = [], isLoading: isLoadingParentCompanies } =
    useParentCompanies()

  const parentCompanyOptions = useMemo(() => {
    return [
      { id: '', name: copy.allParentCompaniesOption },
      ...parentCompanies,
    ]
  }, [parentCompanies])

  const {
    data: employersResult,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useEmployers(selectedParentCompanyId || undefined, pagination)

  const employers = employersResult?.items ?? []
  const navigate = useNavigate()

  const columns = useMemo(
    () =>
      getEmployerTableColumns({
        onEdit: (_employer: Employer) => {
          navigate({ to: ROUTES.ADMIN_EMPLOYERS_EDIT })
        },
        onDelete: (employer: Employer) => {
          console.log('Delete employer', employer.id)
        },
      }),
    [navigate],
  )

  const handleParentCompanyChange = (value: string) => {
    setSelectedParentCompanyId(value === '' ? undefined : value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <main className="page-wrap py-8">
      <div className="mb-6">
        <p className="island-kicker">{copy.kicker}</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">{copy.description}</p>
      </div>

      {/* Top Filter Controls */}
      <div className="mb-6 max-w-sm">
        <ParentCompanySearchSelect
          id="employer-parent-company-select"
          options={parentCompanyOptions}
          value={selectedParentCompanyId ?? ''}
          onValueChange={handleParentCompanyChange}
          isLoading={isLoadingParentCompanies}
          placeholder={copy.selectParentCompanyPlaceholder}
          loadingPlaceholder="Loading parent companies..."
          searchPlaceholder="Search parent companies..."
          noResultsMessage="No parent companies match your search."
        />
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
        data={employers}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={employersResult?.totalPages}
        rowCount={employersResult?.totalCount ?? 0}
      />
    </main>
  )
}
