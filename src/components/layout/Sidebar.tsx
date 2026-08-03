import { ChevronRight, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button.tsx'
import { adminSidebar } from '#/static/admin-sidebar.ts'
import { employeeSidebar } from '#/static/employee-sidebar.ts'
import { cn } from '#/lib/utils.ts'
import type {
  NavigationRole,
  NavigationRoleInput,
  SidebarItem,
  SidebarSection,
} from '#/types/navigation.ts'

const sidebarByRole: Record<NavigationRole, SidebarSection[]> = {
  ADMIN: adminSidebar,
  EMPLOYEE: employeeSidebar,
}

function normalizeRole(role: NavigationRoleInput): NavigationRole {
  const normalizedRole = role.toString().toUpperCase()

  if (normalizedRole === 'ADMIN') {
    return 'ADMIN'
  }

  return 'EMPLOYEE'
}

function isItemActive(item: SidebarItem, pathname: string): boolean {
  const isCurrentRoute =
    pathname === item.route || pathname.startsWith(`${item.route}/`)

  return (
    isCurrentRoute ||
    item.children?.some((child) => isItemActive(child, pathname)) === true
  )
}

function SidebarNavItem({
  item,
  pathname,
  depth = 0,
}: {
  item: SidebarItem
  pathname: string
  depth?: number
}) {
  const navigate = useNavigate()
  const active = isItemActive(item, pathname)
  const hasChildren = Boolean(item.children?.length)
  const Icon = item.icon

  return (
    <li>
      <button
        type="button"
        onClick={() => void navigate({ to: item.route })}
        className={cn(
          'group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
          'text-white/90 hover:bg-sidebar-accent/60 hover:text-white',
          active &&
            'bg-sidebar-accent text-white shadow-xs font-bold ring-1 ring-slate-600',
          depth > 0 && 'py-1.5 text-xs font-medium text-slate-300 hover:text-white',
        )}
        style={{ paddingLeft: `${0.75 + depth * 0.85}rem` }}
        aria-current={pathname === item.route ? 'page' : undefined}
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon ? (
            <Icon
              className={cn(
                'size-4 shrink-0 transition-colors',
                active ? 'text-tan-accent' : 'text-slate-400 group-hover:text-tan-accent',
              )}
              aria-hidden="true"
            />
          ) : null}
          <span className="truncate">{item.title}</span>
        </span>
        {hasChildren ? (
          <ChevronRight
            className={cn(
              'size-4 transition-transform text-slate-400',
              active && 'rotate-90 text-tan-accent',
            )}
          />
        ) : null}
      </button>

      {hasChildren ? (
        <ul className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <SidebarNavItem
              key={child.id}
              item={child}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

interface SidebarProps {
  role: NavigationRoleInput
  onLogout: () => void
  className?: string
}

export function Sidebar({ role, onLogout, className }: SidebarProps) {
  const { pathname } = useLocation()
  const normalizedRole = normalizeRole(role)
  const sections = sidebarByRole[normalizedRole]

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <nav
        aria-label={`${normalizedRole.toLowerCase()} navigation`}
        className="flex-1 overflow-y-auto px-4 py-5"
      >
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2
                id={`${section.id}-heading`}
                className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.14em] text-tan-accent"
              >
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          aria-label="Log out"
          className="w-full justify-start gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:bg-sidebar-accent/60 hover:text-white"
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
