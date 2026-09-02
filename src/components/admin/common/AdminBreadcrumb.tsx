import * as React from 'react'
import { Link } from '@tanstack/react-router'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb.tsx'
import { useBreadcrumbs } from '#/hooks/common/use-breadcrumbs.ts'
import { cn } from '#/lib/utils.ts'

import type { BreadcrumbItemConfig } from '#/hooks/common/use-breadcrumbs.ts'

export interface AdminBreadcrumbProps {
  items?: BreadcrumbItemConfig[]
  currentLabel?: string
  className?: string
}

export function AdminBreadcrumb({
  items: customItems,
  currentLabel,
  className,
}: AdminBreadcrumbProps) {
  const items = useBreadcrumbs({
    items: customItems,
    currentLabel,
  })

  if (!items || items.length === 0) {
    return null
  }

  return (
    <Breadcrumb className={cn('mb-6', className)}>
      <BreadcrumbList className="text-sm font-medium text-tan-dark/90">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="font-normal text-slate-600">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.href}
                      className="text-tan-dark/90 transition-colors hover:text-tan-dark hover:underline"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
