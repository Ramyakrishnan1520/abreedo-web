import { useMemo, useState } from 'react'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import { TableSearchInput } from '#/components/admin/common/TableSearchInput.tsx'
import { FORM_INPUT_CLASS } from '#/components/admin/common/form-styles.ts'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { Label } from '#/components/ui/label.tsx'
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
  onClearSearch: () => void
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
  onClearSearch,
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
    <div className="space-y-4">
      <TableSearchInput
        id="plan-search-input"
        value={searchTerm}
        onChange={onSearchTermChange}
        onClear={onClearSearch}
        placeholder={editCopy.searchPlaceholder}
        clearLabel={editCopy.clearButton}
      />

      <Card className="border-slate-200 shadow-xs">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <div className="space-y-2">
            <Label
              htmlFor="parent-company-filter-select"
              className="text-sm font-semibold text-slate-700"
            >
              {copy.parentCompanyLabel}
            </Label>
            <ConfigurableSelect
              id="parent-company-filter-select"
              value={parentCompanyId || ''}
              onValueChange={(val) =>
                onParentCompanyChange(val ? val : undefined)
              }
              options={parentCompanyOptions}
              loading={isLoadingParentCompanies}
              placeholder={copy.parentCompanyPlaceholder}
              loadingPlaceholder={copy.loadingMore}
              searchable
              clearable
              searchPlaceholder="Search parent companies..."
              emptyOptionLabel={copy.allParentCompanies}
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

          <div className="space-y-2">
            <Label
              htmlFor="carrier-filter-select"
              className="text-sm font-semibold text-slate-700"
            >
              {copy.carrierLabel}
            </Label>
            <ConfigurableSelect
              id="carrier-filter-select"
              value={carrierId || ''}
              onValueChange={(val) => onCarrierChange(val ? val : undefined)}
              options={carrierOptions}
              loading={isLoadingCarriers}
              placeholder={copy.carrierPlaceholder}
              loadingPlaceholder={copy.loadingMore}
              searchable
              clearable
              searchPlaceholder="Search carriers..."
              emptyOptionLabel={copy.allCarriers}
              onClear={() => onCarrierChange(undefined)}
              open={carrierSelectOpen}
              onOpenChange={setCarrierSelectOpen}
              onContentRef={setCarrierSelectContent}
              loadMoreRef={carrierLoadMoreRef}
              isFetchingNextPage={isFetchingNextCarriersPage}
              loadingMoreLabel={copy.loadingMore}
              triggerClassName={FORM_INPUT_CLASS}
              contentClassName="max-h-80"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
