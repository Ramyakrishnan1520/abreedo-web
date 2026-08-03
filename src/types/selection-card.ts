import type * as React from 'react'
import type { LucideIcon } from 'lucide-react'

export interface SelectionCardProps {
  title: React.ReactNode
  description?: React.ReactNode
  to?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  icon?: LucideIcon
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  disabled?: boolean
}
