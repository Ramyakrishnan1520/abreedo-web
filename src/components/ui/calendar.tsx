import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '#/lib/utils.ts'
import { buttonVariants } from '#/components/ui/button.tsx'

export interface CalendarProps {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  minDate?: Date
  maxDate?: Date
  initialFocus?: boolean
  defaultMonth?: Date
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function isSameDay(d1: Date | null | undefined, d2: Date | null | undefined): boolean {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  disabled,
  minDate,
  maxDate,
  defaultMonth,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    if (selected instanceof Date && !isNaN(selected.getTime())) {
      return new Date(selected.getFullYear(), selected.getMonth(), 1)
    }
    if (defaultMonth instanceof Date && !isNaN(defaultMonth.getTime())) {
      return new Date(defaultMonth.getFullYear(), defaultMonth.getMonth(), 1)
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  })

  // Sync currentMonth when selected changes externally
  React.useEffect(() => {
    if (selected instanceof Date && !isNaN(selected.getTime())) {
      setCurrentMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
    }
  }, [selected])

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10)
    setCurrentMonth(new Date(newYear, month, 1))
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10)
    setCurrentMonth(new Date(year, newMonth, 1))
  }

  // Generate calendar grid
  const firstDayOfMonth = new Date(year, month, 1)
  const startingDayOfWeek = firstDayOfMonth.getDay() // 0 is Sunday
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const calendarDays: Array<{
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
    isDisabled: boolean
  }> = []

  const today = new Date()

  // Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, daysInPrevMonth - i)
    const isDisabled =
      Boolean(disabled?.(prevDate)) ||
      Boolean(minDate && prevDate < minDate) ||
      Boolean(maxDate && prevDate > maxDate)
    calendarDays.push({
      date: prevDate,
      isCurrentMonth: false,
      isToday: isSameDay(prevDate, today),
      isSelected: isSameDay(prevDate, selected),
      isDisabled,
    })
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const currentDate = new Date(year, month, day)
    const isDisabled =
      Boolean(disabled?.(currentDate)) ||
      Boolean(minDate && currentDate < minDate) ||
      Boolean(maxDate && currentDate > maxDate)
    calendarDays.push({
      date: currentDate,
      isCurrentMonth: true,
      isToday: isSameDay(currentDate, today),
      isSelected: isSameDay(currentDate, selected),
      isDisabled,
    })
  }

  // Next month leading days to complete the 6 rows (42 cells) or 35 cells
  const remainingCells = (7 - (calendarDays.length % 7)) % 7
  for (let day = 1; day <= remainingCells; day++) {
    const nextDate = new Date(year, month + 1, day)
    const isDisabled =
      Boolean(disabled?.(nextDate)) ||
      Boolean(minDate && nextDate < minDate) ||
      Boolean(maxDate && nextDate > maxDate)
    calendarDays.push({
      date: nextDate,
      isCurrentMonth: false,
      isToday: isSameDay(nextDate, today),
      isSelected: isSameDay(nextDate, selected),
      isDisabled,
    })
  }

  const handleSelectDay = (date: Date, isDisabled: boolean) => {
    if (isDisabled) return
    onSelect?.(date)
  }

  // Year options for quick select (current year +/- 50 years)
  const currentFullYear = new Date().getFullYear()
  const startYear = currentFullYear - 70
  const endYear = currentFullYear + 30
  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  return (
    <div
      data-slot="calendar"
      className={cn('p-3 bg-white select-none', className, classNames?.root)}
    >
      {/* Header Navigation */}
      <div className="flex items-center justify-between gap-1 pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={handlePrevMonth}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-slate-100 border-slate-200 text-slate-700 cursor-pointer',
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <select
            value={month}
            onChange={handleMonthChange}
            aria-label="Select month"
            className="h-7 rounded border border-slate-200 bg-transparent px-1 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-tan-dark"
          >
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={handleYearChange}
            aria-label="Select year"
            className="h-7 rounded border border-slate-200 bg-transparent px-1 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-tan-dark"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-slate-100 border-slate-200 text-slate-700 cursor-pointer',
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center">
        {WEEKDAY_NAMES.map((dayName) => (
          <div
            key={dayName}
            className="text-[0.75rem] font-semibold text-slate-400 py-1"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item, index) => {
          if (!item.isCurrentMonth && !showOutsideDays) {
            return <div key={index} className="h-8 w-8" />
          }

          return (
            <button
              key={index}
              type="button"
              disabled={item.isDisabled}
              onClick={() => handleSelectDay(item.date, item.isDisabled)}
              className={cn(
                'h-8 w-8 text-xs rounded-md font-medium flex items-center justify-center transition-colors cursor-pointer',
                // Normal current month day
                item.isCurrentMonth
                  ? 'text-slate-800 hover:bg-tan-light/70 hover:text-slate-900'
                  : 'text-slate-400 opacity-50 hover:bg-slate-100',
                // Today indicator
                item.isToday &&
                  !item.isSelected &&
                  'border border-tan-dark font-bold text-tan-dark',
                // Selected day
                item.isSelected &&
                  'bg-tan-dark text-white font-bold hover:bg-tan-dark hover:text-white shadow-xs',
                // Disabled day
                item.isDisabled &&
                  'opacity-30 cursor-not-allowed hover:bg-transparent text-slate-400',
              )}
              aria-label={item.date.toDateString()}
              aria-selected={item.isSelected}
            >
              {item.date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
