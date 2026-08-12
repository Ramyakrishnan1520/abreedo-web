import { Loader2 } from 'lucide-react'

import { cn } from '#/lib/utils.ts'
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

interface ConfigurableSelectProps {
  id?: string
  value?: string
  onValueChange: (value: string) => void
  options: SelectOption[]
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
}

export function ConfigurableSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option...',
  loading = false,
  loadingPlaceholder = 'Loading...',
  disabled = false,
  triggerClassName,
  contentClassName,
  open,
  onOpenChange,
  onContentRef,
  loadMoreRef,
  isFetchingNextPage = false,
  loadingMoreLabel = 'Loading more...',
}: ConfigurableSelectProps) {
  const isDisabled = disabled || loading

  return (
    <div className="w-full min-w-0">
      <Select
        value={value || undefined}
        onValueChange={onValueChange}
        disabled={isDisabled}
        open={open}
        onOpenChange={onOpenChange}
      >
        <SelectTrigger id={id} className={cn('w-full min-w-0', triggerClassName)}>
          <SelectValue placeholder={loading ? loadingPlaceholder : placeholder} />
        </SelectTrigger>
        <SelectContent
          ref={onContentRef}
          position="popper"
          className={contentClassName}
        >
          {options.map((option) => (
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
