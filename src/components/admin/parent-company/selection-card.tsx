import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Card, CardDescription, CardTitle } from '#/components/ui/card.tsx'
import { cn } from '#/lib/utils.ts'
import type { SelectionCardProps } from '#/types/selection-card.ts'

export type { SelectionCardProps }

export function SelectionCard({
  title,
  description,
  to,
  onClick,
  icon: Icon = ArrowRight,
  className,
  titleClassName,
  descriptionClassName,
  disabled = false,
}: SelectionCardProps) {
  const navigate = useNavigate()

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (disabled) {
      return
    }

    if (onClick) {
      onClick(event)
      return
    }

    if (to) {
      void navigate({ to })
    }
  }

  const content = (
    <Card
      className={cn(
        'group relative flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-5 md:px-6 md:py-5 text-left transition-all duration-200 shadow-2xs',
        !disabled &&
          'cursor-pointer hover:border-tan-dark/70 hover:bg-tan-light/25 hover:shadow-md focus-visible:outline-2 focus-visible:outline-tan-dark',
        disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
        className,
      )}
    >
      <div className="flex flex-col gap-1 pr-4">
        <CardTitle
          className={cn(
            'text-lg font-bold tracking-tight text-slate-900 group-hover:text-tan-dark transition-colors',
            titleClassName,
          )}
        >
          {title}
        </CardTitle>
        {description ? (
          <CardDescription
            className={cn('text-sm text-slate-600', descriptionClassName)}
          >
            {description}
          </CardDescription>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center justify-center text-tan-dark transition-all duration-200 group-hover:translate-x-1">
        <Icon className="h-6 w-6 stroke-[2.25]" />
      </div>
    </Card>
  )

  if (onClick || to || disabled) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="block w-full text-left focus:outline-none cursor-pointer disabled:cursor-not-allowed"
      >
        {content}
      </button>
    )
  }

  return content
}
