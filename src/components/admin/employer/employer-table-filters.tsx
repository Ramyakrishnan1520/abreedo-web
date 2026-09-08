import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Search, X } from 'lucide-react'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import { FORM_INPUT_CLASS } from '#/components/admin/common/form-styles.ts'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { useAvailableParentCompanies } from '#/hooks/parent-company/useAvailableParentCompanies.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

interface EmployerTableFiltersProps {
  parentCompanyId?: string
  searchTerm: string
  onParentCompanyChange: (id: string | undefined) => void
  onSearchTermChange: (term: string) => void
  onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void
  onClearSearch: () => void
}

const copy = EMPLOYER_CONTENT.filters
const editCopy = EMPLOYER_CONTENT.pages.edit

export function EmployerTableFilters({
  parentCompanyId,
  searchTerm,
  onParentCompanyChange,
  onSearchTermChange,
  onSearchSubmit,
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

      {/* 2. Search Input & Search Button */}
      <form
        onSubmit={onSearchSubmit}
        className="flex flex-1 items-center gap-2 min-w-0"
      >
        <div className="relative flex-1 min-w-0">
          <Input
            id="employer-search-input"
            type="text"
            placeholder={editCopy.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className={FORM_INPUT_CLASS}
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={editCopy.clearButton}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <Button
          id="employer-search-btn"
          type="submit"
          className="h-10 gap-2 bg-tan-dark font-semibold text-white shadow-xs hover:bg-tan-dark/90 cursor-pointer shrink-0"
        >
          <Search className="size-4" />
          {editCopy.searchButton}
        </Button>
      </form>
    </div>
  )
}
