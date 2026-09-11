import { Search, X } from 'lucide-react'

import { FORM_INPUT_CLASS } from '#/components/admin/common/form-styles.ts'
import { Input } from '#/components/ui/input.tsx'
import { cn } from '#/lib/utils.ts'

interface TableSearchInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder: string
  clearLabel: string
  className?: string
}

export function TableSearchInput({
  id,
  value,
  onChange,
  onClear,
  placeholder,
  clearLabel,
  className,
}: TableSearchInputProps) {
  return (
    <div className={cn('relative max-w-sm', className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
        className={cn(FORM_INPUT_CLASS, 'pl-9', value && 'pr-9')}
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label={clearLabel}
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
