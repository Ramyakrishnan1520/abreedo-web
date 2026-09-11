import { useMemo, useState } from 'react'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import { TableSearchInput } from '#/components/admin/common/TableSearchInput.tsx'
import { FORM_INPUT_CLASS } from '#/components/admin/common/form-styles.ts'
import { useAvailableParentCompanies } from '#/hooks/parent-company/useAvailableParentCompanies.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

interface EmployerTableFiltersProps {
  parentCompanyId?: string
  searchTerm: string
  onParentCompanyChange: (id: string | undefined) => void
  onSearchTermChange: (term: string) => void
  onClearSearch: () => void
}

const copy = EMPLOYER_CONTENT.filters
const editCopy = EMPLOYER_CONTENT.pages.edit

export function EmployerTableFilters({
  parentCompanyId,
  searchTerm,
  onParentCompanyChange,
  onSearchTermChange,
  onClearSearch,
}: EmployerTableFiltersProps) {
  const {
    parentCompanies = [],
    isLoading: isLoadingParentCompanies,
    isFetchingNextPage: isFetchingNextParentCompaniesPage,
    hasNextPage: hasNextParentCompaniesPage,
    fetchNextPage: fetchNextParentCompaniesPage,
  } = useAvailableParentCompanies()

  const [parentCompanySelectContent, setParentCompanySelectContent] =
    useState<HTMLDivElement | null>(null)
  const [parentCompanySelectOpen, setParentCompanySelectOpen] = useState(false)
  const parentCompanyLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: hasNextParentCompaniesPage,
    isFetchingNextPage: isFetchingNextParentCompaniesPage,
    fetchNextPage: fetchNextParentCompaniesPage,
    enabled: parentCompanySelectOpen,
    root: parentCompanySelectContent,
  })

  const parentCompanyOptions = useMemo(
    () =>
      parentCompanies
        .filter((pc) => Boolean(pc.id && String(pc.id).trim() !== ''))
        .map((pc) => ({
          value: String(pc.id),
          label: pc.name,
        })),
    [parentCompanies],
  )

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* 1. Parent Company Filter */}
      <div className="w-full lg:w-72 shrink-0">
        <ConfigurableSelect
          id="employer-parent-company-filter-select"
          value={parentCompanyId || ''}
          onValueChange={(val) => onParentCompanyChange(val ? val : undefined)}
          options={parentCompanyOptions}
          loading={isLoadingParentCompanies}
          placeholder={copy.parentCompanyPlaceholder}
          loadingPlaceholder={copy.loadingMore}
          searchable
          clearable
          searchPlaceholder="Search parent companies..."
          emptyOptionLabel="Please Select"
          onClear={() => onParentCompanyChange(undefined)}
          open={parentCompanySelectOpen}
          onOpenChange={setParentCompanySelectOpen}
          onContentRef={setParentCompanySelectContent}
          loadMoreRef={parentCompanyLoadMoreRef}
          isFetchingNextPage={isFetchingNextParentCompaniesPage}
          loadingMoreLabel={copy.loadingMore}
          triggerClassName={FORM_INPUT_CLASS}
          contentClassName="max-h-80"
        />
      </div>

      <TableSearchInput
        id="employer-search-input"
        value={searchTerm}
        onChange={onSearchTermChange}
        onClear={onClearSearch}
        placeholder={editCopy.searchPlaceholder}
        clearLabel={editCopy.clearButton}
        className="w-full lg:w-72"
      />
    </div>
  )
}
