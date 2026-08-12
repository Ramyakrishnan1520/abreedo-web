import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Info, Loader2, Search } from 'lucide-react'
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
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'
import { useParentCompany } from '#/hooks/parent-company/useParentCompany.ts'
import { cn } from '#/lib/utils.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'
import type { CarrierListItemProps } from '#/types/parent-company.ts'

const copy = EMPLOYER_CONTENT.carriersStep

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
  const form = useFormContext<EmployerFormValues>()
  const [availableSearchQuery, setAvailableSearchQuery] = useState('')
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('')

  const parentCompanyId = form.watch('parentCompanyId')
  const {
    data: parentCompany,
    isLoading,
    isError,
  } = useParentCompany(parentCompanyId || undefined)

  // Option A with Deduplication by carrierId
  const carriers = useMemo(() => {
    const rawCarriers = parentCompany?.carriers ?? []
    const map = new Map<string, { id: string; name: string }>()

    for (const item of rawCarriers) {
      const id = item.carrierId ?? (item as unknown as { id: string }).id
      const name = item.name
      if (id && name && !map.has(id)) {
        map.set(id, { id, name })
      }
    }

    return Array.from(map.values())
  }, [parentCompany?.carriers])

  const selectedCarrierIds = form.watch('carrierIds') ?? []
  const linkedCarriers = form.watch('linkedCarriers') ?? []

  const uniqueSelectedCarrierIds = useMemo(
    () => [...new Set(selectedCarrierIds)],
    [selectedCarrierIds],
  )

  const selectedCarriers = useMemo(
    () =>
      resolveSelectedCarrierOptions(
        uniqueSelectedCarrierIds,
        carriers,
        linkedCarriers,
      ),
    [carriers, linkedCarriers, uniqueSelectedCarrierIds],
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
    const current = form.getValues('carrierIds') ?? []

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
      [...new Set(form.getValues('carrierIds') ?? [])].filter(
        (item) => item !== carrierId,
      ),
      { shouldDirty: true, shouldValidate: true },
    )
  }

  const totalCount = carriers.length
  const shownCountLabel = copy.shownCount.replace(
    '{{count}}',
    String(availableCarriers.length),
  )

  if (!parentCompanyId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-12 px-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-tan-dark/10 text-tan-dark mb-3">
          <Info className="size-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">
          No Parent Company Selected
        </h4>
        <p className="mt-1 max-w-md text-sm text-slate-600">
          Please select a Parent Company in Step 1 (General) to view and assign its associated carriers.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-600">
          <Loader2 className="size-4 animate-spin" />
          {copy.loading}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {copy.loadError}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-b border-slate-200 px-4 py-4">
              <CardTitle className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-slate-700">
                <span className="flex items-center gap-2">
                  {copy.availableHeading}
                  <Badge variant="secondary">{totalCount}</Badge>
                </span>
                {availableSearchQuery.trim() ? (
                  <span className="text-xs font-medium normal-case tracking-normal text-slate-500">
                    {shownCountLabel}
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
                  placeholder={copy.searchAvailablePlaceholder}
                  className="h-9 rounded-md border-slate-200 bg-slate-50/50 pl-9 focus:border-tan-dark focus:bg-white"
                />
              </div>
              <ScrollArea className="h-72 pr-3">
                <div className="space-y-2">
                  {availableCarriers.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      {copy.noSearchMatches}
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
                          actionLabel={
                            isSelected ? copy.actionSelected : copy.actionSelect
                          }
                          disabled={isSelected}
                          onAction={() => addCarrier(carrier.id)}
                        />
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-b border-slate-200 px-4 py-4">
              <CardTitle className="flex items-center justify-between text-sm font-bold uppercase tracking-wide text-slate-700">
                {copy.selectedHeading}
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
                  placeholder={copy.searchSelectedPlaceholder}
                  className="h-9 rounded-md border-slate-200 bg-slate-50/50 pl-9 focus:border-tan-dark focus:bg-white"
                />
              </div>
              <ScrollArea className="h-72 pr-3">
                <div className="space-y-2">
                  {filteredSelectedCarriers.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      {selectedCarriers.length === 0
                        ? copy.noneSelected
                        : copy.noSelectedSearchMatches}
                    </p>
                  ) : (
                    filteredSelectedCarriers.map((carrier) => (
                      <CarrierListItem
                        key={carrier.id}
                        name={carrier.name}
                        actionLabel={copy.actionRemove}
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
        {copy.hintLeft}
        <ChevronLeft className="size-4 text-tan-dark" aria-hidden />
        {copy.hintRight}
      </div>
    </div>
  )
}
