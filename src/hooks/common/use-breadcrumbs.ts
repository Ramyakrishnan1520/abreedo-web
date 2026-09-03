import { useMemo } from 'react'
import { useRouterState } from '@tanstack/react-router'

import { ROUTES } from '#/static/routes.ts'
import { getBreadcrumbLabel, getBreadcrumbPath } from '#/utils/breadcrumb-labels.ts'

export interface BreadcrumbItemConfig {
  label: string
  href?: string
}

export interface UseBreadcrumbsOptions {
  items?: BreadcrumbItemConfig[]
  currentLabel?: string
}

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

export function useBreadcrumbs(options?: UseBreadcrumbsOptions): BreadcrumbItemConfig[] {
  const pathname = useRouterState({
    select: (state) => normalizePath(state.location.pathname),
  })

  return useMemo(() => {
    if (options?.items && options.items.length > 0) {
      return options.items
    }

    if (
      pathname === '/' ||
      pathname === normalizePath(ROUTES.LOGIN) ||
      pathname === normalizePath(ROUTES.ADMIN_ROOT)
    ) {
      return []
    }

    const segments = pathname.split('/').filter(Boolean)
    const trail: BreadcrumbItemConfig[] = []
    let currentAccumulatedPath = ''

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      currentAccumulatedPath += `/${segment}`
      const isLast = i === segments.length - 1

      // Skip root prefixes and intermediate directory wrappers when followed by destination subpaths
      if (
        currentAccumulatedPath === '/admin' ||
        currentAccumulatedPath === '/employer' ||
        (currentAccumulatedPath === '/admin/employers' && !isLast)
      ) {
        continue
      }

      const label = getBreadcrumbLabel(currentAccumulatedPath, segment)
      const resolvedHref = getBreadcrumbPath(currentAccumulatedPath)

      trail.push({
        label,
        href: isLast ? undefined : resolvedHref,
      })
    }

    if (trail.length > 0 && options?.currentLabel) {
      const lastIndex = trail.length - 1
      trail[lastIndex] = {
        ...trail[lastIndex],
        label: options.currentLabel,
      }
    }

    return trail
  }, [pathname, options?.items, options?.currentLabel])
}
