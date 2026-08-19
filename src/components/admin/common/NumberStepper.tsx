import * as React from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { cn } from '#/lib/utils'

export interface NumberStepperProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  id?: string
}

export const NumberStepper = React.forwardRef<
  HTMLInputElement,
  NumberStepperProps
>(
  (
    {
      value = 0,
      onChange,
      min = 0,
      max = 120,
      step = 1,
      disabled = false,
      className,
      id,
    },
    ref,
  ) => {
    const handleDecrement = () => {
      if (disabled) return
      const newValue = Math.max(min, value - step)
      onChange?.(newValue)
    }

    const handleIncrement = () => {
      if (disabled) return
      const newValue = Math.min(max, value + step)
      onChange?.(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseInt(e.target.value, 10)
      if (isNaN(parsed)) {
        onChange?.(min)
      } else {
        const clamped = Math.min(max, Math.max(min, parsed))
        onChange?.(clamped)
      }
    }

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label="Decrease value"
          className="size-9 rounded-md border-slate-200 hover:bg-slate-100 disabled:opacity-50"
        >
          <Minus className="size-4" />
        </Button>
        <Input
          ref={ref}
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className="h-9 w-24 text-center font-semibold text-slate-800 focus-visible:ring-tan-dark"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label="Increase value"
          className="size-9 rounded-md border-slate-200 hover:bg-slate-100 disabled:opacity-50"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    )
  },
)

NumberStepper.displayName = 'NumberStepper'
