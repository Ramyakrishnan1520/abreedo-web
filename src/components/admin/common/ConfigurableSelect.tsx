import { useMemo, useState } from 'react'
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react'

import { cn } from '#/lib/utils.ts'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'

export interface SelectOption {
  value: string
  label: string
}

export interface ConfigurableSelectProps {
  id?: string
  value?: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  selectedLabel?: string
  placeholder?: string
  loading?: boolean
  loadingPlaceholder?: string
  disabled?: boolean
  triggerClassName?: string
  contentClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onContentRef?: (node: HTMLDivElement | null) => void
  loadMoreRef?: React.RefObject<HTMLDivElement | null>
  isFetchingNextPage?: boolean
  loadingMoreLabel?: string
  searchable?: boolean
  searchPlaceholder?: string
  clearable?: boolean
  emptyOptionLabel?: string
  onClear?: () => void
  noResultsText?: string
}

export function ConfigurableSelect({
  id,
  value,
  onValueChange,
  options,
  selectedLabel,
  placeholder = 'Select an option...',
  loading = false,
  loadingPlaceholder = 'Loading...',
  disabled = false,
  triggerClassName,
  contentClassName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onContentRef,
  loadMoreRef,
  isFetchingNextPage = false,
  loadingMoreLabel = 'Loading more...',
  searchable = false,
  searchPlaceholder = 'Search...',
  clearable = false,
  emptyOptionLabel,
  onClear,
  noResultsText = 'No options found',
}: ConfigurableSelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    controlledOnOpenChange?.(nextOpen)
    if (!nextOpen) {
      setSearchTerm('')
    }
  }

  const isDisabled = disabled || loading

  const effectiveOptions = useMemo(() => {
    if (!value) return options
    const exists = options.some((opt) => String(opt.value) === String(value))
    if (!exists && selectedLabel) {
      return [{ value, label: selectedLabel }, ...options]
    }
    return options
  }, [options, value, selectedLabel])

  const selectedOption = useMemo(() => {
    if (!value) return null
    return (
      effectiveOptions.find((opt) => String(opt.value) === String(value)) ||
      (selectedLabel ? { value, label: selectedLabel } : null)
    )
  }, [effectiveOptions, selectedLabel, value])

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return effectiveOptions
    const term = searchTerm.trim().toLowerCase()
    return effectiveOptions.filter((opt) =>
      opt.label.toLowerCase().includes(term),
    )
  }, [effectiveOptions, searchTerm, searchable])

  // Searchable combobox dropdown using Popover
  if (searchable) {
    return (
      <div className="w-full min-w-0">
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              id={id}
              type="button"
              disabled={isDisabled}
              className={cn(
                'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs transition-colors focus:border-tan-dark focus:outline-hidden focus:ring-1 focus:ring-tan-dark disabled:cursor-not-allowed disabled:opacity-50',
                triggerClassName,
              )}
            >
              <span
                className={cn(
                  'truncate text-left flex-1',
                  selectedOption
                    ? 'font-medium text-[#94723C]'
                    : 'text-slate-400',
                )}
              >
                {loading
                  ? loadingPlaceholder
                  : selectedOption?.label || placeholder}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                {clearable && selectedOption && !isDisabled ? (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Clear selection"
                    onClick={(e) => {
                      e.stopPropagation()
                      onValueChange('')
                      onClear?.()
                    }}
                    className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer rounded transition-colors"
                  >
                    <X className="size-3.5" />
                  </span>
                ) : null}
                <ChevronDown className="size-4 text-slate-400 opacity-60" />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={4}
            className={cn(
              'z-50 w-(--radix-popover-trigger-width) min-w-[16rem] max-h-80 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-lg',
              contentClassName,
            )}
          >
            {/* Search Input Box */}
            <div className="p-2.5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2 rounded-lg border border-[#BFA780] bg-white px-3 py-1.5 ring-2 ring-[#BFA780]/20">
                <Search className="size-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                  autoFocus
                />
                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Options List */}
            <div
              ref={onContentRef}
              className="max-h-56 overflow-y-auto p-1.5 space-y-0.5"
            >
              {emptyOptionLabel ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onValueChange('')
                    onClear?.()
                    handleOpenChange(false)
                  }}
                  className={cn(
                    'flex w-full items-center px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer text-slate-700 hover:bg-slate-100',
                    !value && 'font-medium',
                  )}
                >
                  {emptyOptionLabel}
                </div>
              ) : null}

              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  {noResultsText}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = String(option.value) === String(value)
                  return (
                    <div
                      key={option.value}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onValueChange(option.value)
                        handleOpenChange(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-[#F7F2EB] font-medium text-slate-900'
                          : 'text-slate-700 hover:bg-slate-100',
                      )}
                    >
                      {isSelected ? (
                        <Check className="size-4 shrink-0 text-slate-800" />
                      ) : (
                        <span className="w-4 shrink-0" />
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>
                  )
                })
              )}

              {loadMoreRef ? (
                <div ref={loadMoreRef} className="h-px" aria-hidden />
              ) : null}
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
                  <Loader2 className="size-3.5 animate-spin" />
                  {loadingMoreLabel}
                </div>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  // Standard select
  return (
    <div className="w-full min-w-0">
      <Select
        key={value || '__empty__'}
        value={value || undefined}
        onValueChange={onValueChange}
        disabled={isDisabled}
        open={controlledOpen}
        onOpenChange={controlledOnOpenChange}
      >
        <SelectTrigger
          id={id}
          className={cn('w-full min-w-0', triggerClassName)}
        >
          <SelectValue
            placeholder={loading ? loadingPlaceholder : placeholder}
          />
        </SelectTrigger>
        <SelectContent
          ref={onContentRef}
          position="popper"
          className={contentClassName}
        >
          {effectiveOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              textValue={option.label}
            >
              {option.label}
            </SelectItem>
          ))}
          {loadMoreRef ? (
            <div ref={loadMoreRef} className="h-px" aria-hidden />
          ) : null}
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
              <Loader2 className="size-3.5 animate-spin" />
              {loadingMoreLabel}
            </div>
          ) : null}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ConfigurableSelect

