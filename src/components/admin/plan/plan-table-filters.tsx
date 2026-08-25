import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Search, X } from 'lucide-react'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import { FORM_INPUT_CLASS } from '#/components/admin/common/form-styles.ts'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useAvailableParentCompanies } from '#/hooks/parent-company/useAvailableParentCompanies.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

interface PlanTableFiltersProps {
  parentCompanyId?: string
  carrierId?: string
  searchTerm: string
  onParentCompanyChange: (id: string | undefined) => void
  onCarrierChange: (id: string | undefined) => void
  onSearchTermChange: (term: string) => void
  onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void
  onClearSearch: () => void
  onClearAll: () => void
  hasActiveFiltersOrSearch: boolean
}

const copy = PLAN_CONTENT.filters
const editCopy = PLAN_CONTENT.pages.edit

export function PlanTableFilters({
  parentCompanyId,
  carrierId,
  searchTerm,
  onParentCompanyChange,
  onCarrierChange,
  onSearchTermChange,
  onSearchSubmit,
  onClearSearch,
  onClearAll,
  hasActiveFiltersOrSearch,
}: PlanTableFiltersProps) {
  const {
    parentCompanies = [],
    isLoading: isLoadingParentCompanies,
    isFetchingNextPage: isFetchingNextParentCompaniesPage,
    hasNextPage: hasNextParentCompaniesPage,
    fetchNextPage: fetchNextParentCompaniesPage,
  } = useAvailableParentCompanies()

  const {
    carriers = [],
    isLoading: isLoadingCarriers,
    isFetchingNextPage: isFetchingNextCarriersPage,
    hasNextPage: hasNextCarriersPage,
    fetchNextPage: fetchNextCarriersPage,
  } = useAvailableCarriers()

  // Parent Company infinite scroll setup
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

  // Carrier infinite scroll setup
  const [carrierSelectContent, setCarrierSelectContent] =
    useState<HTMLDivElement | null>(null)
  const [carrierSelectOpen, setCarrierSelectOpen] = useState(false)
  const carrierLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: hasNextCarriersPage,
    isFetchingNextPage: isFetchingNextCarriersPage,
    fetchNextPage: fetchNextCarriersPage,
    enabled: carrierSelectOpen,
    root: carrierSelectContent,
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

  const carrierOptions = useMemo(
    () =>
      carriers
        .filter((carrier) => Boolean(carrier.id && String(carrier.id).trim() !== ''))
        .map((c) => ({
          value: String(c.id),
          label: c.name,
        })),
    [carriers],
  )

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* 1. Parent Company Filter */}
      <div className="w-full lg:w-60 shrink-0">
        <ConfigurableSelect
          id="parent-company-filter-select"
          value={parentCompanyId || ''}
          onValueChange={(val) => onParentCompanyChange(val ? val : undefined)}
          options={parentCompanyOptions}
          loading={isLoadingParentCompanies}
          placeholder={copy.parentCompanyPlaceholder}
          loadingPlaceholder={copy.loadingMore}
          open={parentCompanySelectOpen}
          onOpenChange={setParentCompanySelectOpen}
          onContentRef={setParentCompanySelectContent}
          loadMoreRef={parentCompanyLoadMoreRef}
          isFetchingNextPage={isFetchingNextParentCompaniesPage}
          loadingMoreLabel={copy.loadingMore}
          triggerClassName={FORM_INPUT_CLASS}
          contentClassName="max-h-60"
        />
      </div>

      {/* 2. Carrier Filter */}
      <div className="w-full lg:w-60 shrink-0">
        <ConfigurableSelect
          id="carrier-filter-select"
          value={carrierId || ''}
          onValueChange={(val) => onCarrierChange(val ? val : undefined)}
          options={carrierOptions}
          loading={isLoadingCarriers}
          placeholder={copy.carrierPlaceholder}
          loadingPlaceholder={copy.loadingMore}
          open={carrierSelectOpen}
          onOpenChange={setCarrierSelectOpen}
          onContentRef={setCarrierSelectContent}
          loadMoreRef={carrierLoadMoreRef}
          isFetchingNextPage={isFetchingNextCarriersPage}
          loadingMoreLabel={copy.loadingMore}
          triggerClassName={FORM_INPUT_CLASS}
          contentClassName="max-h-60"
        />
      </div>

      {/* 3. Search Input & Search Button */}
      <form
        onSubmit={onSearchSubmit}
        className="flex flex-1 items-center gap-2 min-w-0"
      >
        <div className="relative flex-1 min-w-0">
          <Input
            id="plan-search-input"
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
          id="plan-search-btn"
          type="submit"
          className="h-10 gap-2 bg-tan-dark font-semibold text-white shadow-xs hover:bg-tan-dark/90 cursor-pointer shrink-0"
        >
          <Search className="size-4" />
          {editCopy.searchButton}
        </Button>
      </form>

      {/* 4. Clear Filters */}
      {hasActiveFiltersOrSearch ? (
        <Button
          id="clear-plan-filters-btn"
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-10 px-3 text-slate-500 hover:text-slate-900 cursor-pointer shrink-0"
        >
          <X className="mr-1.5 size-4" />
          {copy.clearFilters}
        </Button>
      ) : null}
    </div>
  )
}
