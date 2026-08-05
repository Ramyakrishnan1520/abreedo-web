import { useMemo, useState } from 'react'
import { Loader2, X } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useAvailableParentCompanies } from '#/hooks/parent-company/useAvailableParentCompanies.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

interface PlanTableFiltersProps {
  parentCompanyId?: string
  carrierId?: string
  onParentCompanyChange: (id: string | undefined) => void
  onCarrierChange: (id: string | undefined) => void
}

const ALL_VALUE = '__ALL__'
const copy = PLAN_CONTENT.filters

export function PlanTableFilters({
  parentCompanyId,
  carrierId,
  onParentCompanyChange,
  onCarrierChange,
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
      parentCompanies.filter(
        (pc) => Boolean(pc.id && String(pc.id).trim() !== ''),
      ),
    [parentCompanies],
  )

  const carrierOptions = useMemo(
    () =>
      carriers.filter(
        (carrier) => Boolean(carrier.id && String(carrier.id).trim() !== ''),
      ),
    [carriers],
  )

  const hasActiveFilters = Boolean(parentCompanyId || carrierId)

  const handleClearFilters = () => {
    onParentCompanyChange(undefined)
    onCarrierChange(undefined)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Parent Company Filter */}
      <div className="w-full sm:w-64">
        <Select
          value={parentCompanyId ?? ALL_VALUE}
          onValueChange={(val) =>
            onParentCompanyChange(val === ALL_VALUE ? undefined : val)
          }
          disabled={isLoadingParentCompanies}
          open={parentCompanySelectOpen}
          onOpenChange={setParentCompanySelectOpen}
        >
          <SelectTrigger
            id="parent-company-filter-select"
            className="w-full bg-white"
          >
            <SelectValue placeholder={copy.allParentCompanies} />
          </SelectTrigger>
          <SelectContent
            ref={setParentCompanySelectContent}
            position="popper"
            className="max-h-60"
          >
            <SelectItem value={ALL_VALUE}>{copy.allParentCompanies}</SelectItem>
            {parentCompanyOptions.map((pc) => (
              <SelectItem key={pc.id} value={pc.id}>
                {pc.name}
              </SelectItem>
            ))}
            <div
              ref={parentCompanyLoadMoreRef}
              className="h-px"
              aria-hidden
            />
            {isFetchingNextParentCompaniesPage ? (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
                <Loader2 className="size-3.5 animate-spin" />
                {copy.loadingMore}
              </div>
            ) : null}
          </SelectContent>
        </Select>
      </div>

      {/* Carrier Filter */}
      <div className="w-full sm:w-64">
        <Select
          value={carrierId ?? ALL_VALUE}
          onValueChange={(val) =>
            onCarrierChange(val === ALL_VALUE ? undefined : val)
          }
          disabled={isLoadingCarriers}
          open={carrierSelectOpen}
          onOpenChange={setCarrierSelectOpen}
        >
          <SelectTrigger id="carrier-filter-select" className="w-full bg-white">
            <SelectValue placeholder={copy.allCarriers} />
          </SelectTrigger>
          <SelectContent
            ref={setCarrierSelectContent}
            position="popper"
            className="max-h-60"
          >
            <SelectItem value={ALL_VALUE}>{copy.allCarriers}</SelectItem>
            {carrierOptions.map((carrier) => (
              <SelectItem key={carrier.id} value={carrier.id}>
                {carrier.name}
              </SelectItem>
            ))}
            <div
              ref={carrierLoadMoreRef}
              className="h-px"
              aria-hidden
            />
            {isFetchingNextCarriersPage ? (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
                <Loader2 className="size-3.5 animate-spin" />
                {copy.loadingMore}
              </div>
            ) : null}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters ? (
        <Button
          id="clear-plan-filters-btn"
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="h-9 px-3 text-slate-500 hover:text-slate-900"
        >
          <X className="mr-1.5 size-4" />
          {copy.clearFilters}
        </Button>
      ) : null}
    </div>
  )
}
