import { useMemo, useState } from 'react'
// import type { UIEvent } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Input } from '#/components/ui/input.tsx'
import { ScrollArea } from '#/components/ui/scroll-area.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { cn } from '#/lib/utils.ts'
import type {
  CarrierListItemProps,
  ParentCompanyFormValues,
} from '#/types/parent-company.ts'

function CarrierListItem({
  name,
  actionLabel,
  onAction,
  disabled = false,
}: CarrierListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5',
        disabled && 'border-slate-100 bg-slate-50/80',
      )}
    >
      <span
        className={cn(
          'text-sm font-medium text-slate-800',
          disabled && 'text-slate-500',
        )}
      >
        {name}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAction}
        disabled={disabled}
        className="h-8 shrink-0 border-slate-200 text-xs font-semibold"
      >
        {actionLabel}
      </Button>
    </div>
  )
}

export function CarriersStep() {
  const form = useFormContext<ParentCompanyFormValues>()
  const [availableSearchQuery, setAvailableSearchQuery] = useState('')
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('')
  const {
    carriers,
    totalCount,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAvailableCarriers()

  const selectedCarrierIds = form.watch('carrierIds')

  const uniqueSelectedCarrierIds = useMemo(
    () => [...new Set(selectedCarrierIds)],
    [selectedCarrierIds],
  )

  const selectedCarriers = useMemo(
    () =>
      uniqueSelectedCarrierIds
        .map((id) => carriers.find((carrier) => carrier.id === id))
        .filter((carrier): carrier is (typeof carriers)[number] =>
          Boolean(carrier),
        ),
    [carriers, uniqueSelectedCarrierIds],
  )

  const availableCarriers = useMemo(
    () =>
      carriers.filter((carrier) =>
        carrier.name
          .toLowerCase()
          .includes(availableSearchQuery.trim().toLowerCase()),
      ),
    [availableSearchQuery, carriers],
  )

  const filteredSelectedCarriers = useMemo(
    () =>
      selectedCarriers.filter((carrier) =>
        carrier.name
          .toLowerCase()
          .includes(selectedSearchQuery.trim().toLowerCase()),
      ),
    [selectedCarriers, selectedSearchQuery],
  )

  const addCarrier = (carrierId: string) => {
    const current = form.getValues('carrierIds')

    if (current.includes(carrierId)) {
      return
    }

    form.setValue('carrierIds', [...new Set([...current, carrierId])], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const removeCarrier = (carrierId: string) => {
    form.setValue(
      'carrierIds',
      [...new Set(form.getValues('carrierIds'))].filter(
        (item) => item !== carrierId,
      ),
      { shouldDirty: true, shouldValidate: true },
    )
  }

  const [availableScrollRoot, setAvailableScrollRoot] =
    useState<HTMLDivElement | null>(null)
  const loadMoreRef = useLoadMoreIntersection({
    hasNextPage: hasNextPage && !availableSearchQuery.trim(),
    isFetchingNextPage,
    fetchNextPage,
    root: availableScrollRoot,
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Carrier Selection
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Choose carriers associated with this parent company.
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-600">
          <Loader2 className="size-4 animate-spin" />
          Loading carriers...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load carriers. Please refresh the page.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-b border-slate-200 px-4 py-4">
              <CardTitle className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-slate-700">
                <span className="flex items-center gap-2">
                  Available Carriers
                  <Badge variant="secondary">{totalCount}</Badge>
                </span>
                {availableSearchQuery.trim() ? (
                  <span className="text-xs font-medium normal-case tracking-normal text-slate-500">
                    {availableCarriers.length} shown
                  </span>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={availableSearchQuery}
                  onChange={(event) =>
                    setAvailableSearchQuery(event.target.value)
                  }
                  placeholder="Search available carriers..."
                  className="h-9 rounded-md border-slate-200 bg-slate-50/50 pl-9 focus:border-tan-dark focus:bg-white"
                />
              </div>
              <div
                ref={setAvailableScrollRoot}
                className="h-72 overflow-y-auto pr-3"
              >
                <div className="space-y-2">
                  {availableCarriers.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      No carriers match your search.
                    </p>
                  ) : (
                    availableCarriers.map((carrier) => {
                      const isSelected = uniqueSelectedCarrierIds.includes(
                        carrier.id,
                      )

                      return (
                        <CarrierListItem
                          key={carrier.id}
                          name={carrier.name}
                          actionLabel={isSelected ? 'Selected' : 'Select'}
                          disabled={isSelected}
                          onAction={() => addCarrier(carrier.id)}
                        />
                      )
                    })
                  )}
                  <div ref={loadMoreRef} className="h-px" aria-hidden />
                  {isFetchingNextPage ? (
                    <div className="flex items-center justify-center gap-2 py-3 text-xs text-slate-500">
                      <Loader2 className="size-3.5 animate-spin" />
                      Loading more carriers...
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-b border-slate-200 px-4 py-4">
              <CardTitle className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-slate-700">
                Selected Carriers
                <Badge variant="default">{selectedCarriers.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={selectedSearchQuery}
                  onChange={(event) =>
                    setSelectedSearchQuery(event.target.value)
                  }
                  placeholder="Search selected carriers..."
                  className="h-9 rounded-md border-slate-200 bg-slate-50/50 pl-9 focus:border-tan-dark focus:bg-white"
                />
              </div>
              <ScrollArea className="h-72 pr-3">
                <div className="space-y-2">
                  {filteredSelectedCarriers.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      {selectedCarriers.length === 0
                        ? 'No carriers selected yet.'
                        : 'No selected carriers match your search.'}
                    </p>
                  ) : (
                    filteredSelectedCarriers.map((carrier) => (
                      <CarrierListItem
                        key={carrier.id}
                        name={carrier.name}
                        actionLabel="Remove"
                        onAction={() => removeCarrier(carrier.id)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-600">
        <ChevronRight className="size-4 text-tan-dark" aria-hidden />
        Select carriers from the left panel. Already selected carriers stay
        visible but disabled.
        <ChevronLeft className="size-4 text-tan-dark" aria-hidden />
        Remove carriers from the right panel to deselect them.
      </div>
    </div>
  )
}
