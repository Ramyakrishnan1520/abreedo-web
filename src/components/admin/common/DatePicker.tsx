import * as React from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { cn } from '#/lib/utils.ts'
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover.tsx'
import { Calendar } from '#/components/ui/calendar.tsx'

export interface DatePickerProps {
  id?: string
  value?: string | Date | null
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  clearable?: boolean
  'aria-label'?: string
}

/**
 * Parses a YYYY-MM-DD string or Date object into a local Date without timezone offset distortion
 */
function parseDateValue(value: string | Date | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    // Format: YYYY-MM-DD
    const parts = trimmed.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const date = new Date(year, month, day)
      return isNaN(date.getTime()) ? null : date
    }

    const parsed = new Date(trimmed)
    return isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

/**
 * Formats a Date object to YYYY-MM-DD string
 */
function formatDateToIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Formats a Date object for display (e.g. MM/DD/YYYY)
 */
function formatDateForDisplay(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select date...',
  disabled = false,
  className,
  minDate,
  maxDate,
  clearable = true,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => parseDateValue(value), [value])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedIso = formatDateToIso(date)
      onChange?.(formattedIso)
    } else {
      onChange?.('')
    }
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn('relative inline-flex items-center w-full', className)}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-label={ariaLabel || placeholder}
            className={cn(
              'flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-sm text-left font-normal text-slate-900 transition-colors cursor-pointer',
              'hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-tan-dark focus:border-tan-dark focus:bg-white',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100',
              !selectedDate && 'text-slate-400',
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="truncate">
                {selectedDate ? formatDateForDisplay(selectedDate) : placeholder}
              </span>
            </div>

            {clearable && selectedDate && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    onChange?.('')
                  }
                }}
                className="ml-2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 focus:outline-none cursor-pointer"
                aria-label="Clear date"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-auto p-0 border border-slate-200 shadow-lg rounded-lg bg-white overflow-hidden z-50"
        >
          <Calendar
            selected={selectedDate}
            onSelect={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            defaultMonth={selectedDate || undefined}
          />
        </PopoverContent>
      </div>
    </Popover>
  )
}
