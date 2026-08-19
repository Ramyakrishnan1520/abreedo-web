import type { ReactNode } from 'react'

export interface ReviewTextItem {
  type: 'text'
  label: string
  value: string | null | undefined
}

export interface ReviewMultilineItem {
  type: 'multiline'
  value: string | null | undefined
}

export interface ReviewBadgeItem {
  type: 'badges'
  items: Array<{ id: string; name: string }>
  emptyMessage: string
}

export type ReviewItem =
  | ReviewTextItem
  | ReviewMultilineItem
  | ReviewBadgeItem

export interface ReviewSectionConfig {
  id: string
  title: string
  items: ReviewItem[]
}

export interface ReviewStepCopy {
  heading?: string
  description?: string
  emptyValue: string
}

export interface ReviewStepProps {
  copy: ReviewStepCopy
  sections: ReviewSectionConfig[]
  layout?: 'cards' | 'accordion'
  defaultOpenSection?: string
}

export interface ReviewFieldProps {
  label: string
  value: string | null | undefined
  emptyValue: string
}

export interface ReviewCardSectionProps {
  title: string
  children: ReactNode
}

export interface ReviewSectionItemsProps {
  items: ReviewItem[]
  emptyValue: string
}
