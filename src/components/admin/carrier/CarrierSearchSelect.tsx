import { useMemo, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover.tsx'
import { ScrollArea } from '#/components/ui/scroll-area.tsx'
import { cn } from '#/lib/utils.ts'

export interface CarrierSelectItem {
  id: string
  name: string
}

interface CarrierSearchSelectProps {
  id?: string
  options: CarrierSelectItem[]
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
  placeholder: string
  loadingPlaceholder: string
  searchPlaceholder: string
  noResultsMessage: string
  isLoading?: boolean
}

export function CarrierSearchSelect({
  id,
  options,
  value,
  onValueChange,
  disabled = false,
  placeholder,
  loadingPlaceholder,
  searchPlaceholder,
  noResultsMessage,
  isLoading = false,
}: CarrierSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCarrier = useMemo(
    () => options.find((carrier) => carrier.id === value),
    [options, value],
  )

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return options
    }

    return options.filter((carrier) =>
      carrier.name.toLowerCase().includes(query),
    )
  }, [options, searchQuery])

  const triggerLabel = isLoading
    ? loadingPlaceholder
    : (selectedCarrier?.name ?? placeholder)

  const handleSelect = (carrierId: string) => {
    onValueChange(carrierId)
    setOpen(false)
    setSearchQuery('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearchQuery('')
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(
            'h-10 w-full justify-between border-slate-200 bg-white px-3 font-normal shadow-xs hover:bg-white',
            !selectedCarrier && !isLoading && 'text-muted-foreground',
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="border-b border-slate-200 p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 border-slate-200 bg-slate-50/50 pl-8 focus:bg-white"
              autoFocus
            />
          </div>
        </div>
        <ScrollArea className="h-64">
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-slate-500">
                {noResultsMessage}
              </p>
            ) : (
              filteredOptions.map((carrier) => {
                const isSelected = carrier.id === value

                return (
                  <button
                    key={carrier.id}
                    type="button"
                    onClick={() => handleSelect(carrier.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent/60',
                    )}
                  >
                    <Check
                      className={cn(
                        'size-4 shrink-0 text-slate-700',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{carrier.name}</span>
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
