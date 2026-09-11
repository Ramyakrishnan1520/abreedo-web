import React from 'react'
import { IMaskInput } from 'react-imask'

import { cn } from '#/lib/utils.ts'

export interface PhoneInputProps {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  autoFocus?: boolean
  required?: boolean
  type?: string
  inputMode?: 'numeric' | 'tel' | 'text'
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      className,
      placeholder = '(000) 000-0000',
      disabled = false,
      id,
      name,
      ...props
    },
    ref,
  ) => {
    return (
      <IMaskInput
        mask="(000) 000-0000"
        unmask={false}
        value={value || ''}
        inputRef={ref}
        id={id}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        onAccept={(val: string) => {
          onChange?.(val)
        }}
        onBlur={onBlur}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        {...props}
      />
    )
  },
)

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput
