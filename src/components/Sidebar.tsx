import { useEffect, useState } from 'react'
import { ChevronRight, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button.tsx'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion.tsx'
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

function getActiveSectionIds(
  sections: SidebarSection[],
  pathname: string,
): string[] {
  return sections
    .filter((section) =>
      section.items.some((item) => isItemActive(item, pathname)),
    )
    .map((section) => section.id)
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
  const [expanded, setExpanded] = useState(active)

  useEffect(() => {
    if (active) {
      setExpanded(true)
    }
  }, [active])

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) {
            setExpanded((open) => !open)
            return
          }

          void navigate({ to: item.route })
        }}
        className={cn(
          'group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
          'text-white/70 hover:bg-sidebar-accent/60 hover:text-white',
          depth > 0 && 'py-1.5 text-xs font-medium',
          active &&
            'bg-sidebar-accent font-bold text-tan-accent hover:text-tan-accent',
        )}
        style={{ paddingLeft: `${0.75 + depth * 0.85}rem` }}
        aria-current={pathname === item.route ? 'page' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon ? (
            <Icon
              className={cn(
                'size-4 shrink-0 transition-colors',
                active
                  ? 'text-tan-accent'
                  : 'text-slate-400 group-hover:text-tan-accent',
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
              expanded && 'rotate-90 text-tan-accent',
            )}
          />
        ) : null}
      </button>

      {hasChildren ? (
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-200 ease-out',
            expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <ul className="mt-1 space-y-1 overflow-hidden">
            {item.children?.map((child) => (
              <SidebarNavItem
                key={child.id}
                item={child}
                pathname={pathname}
                depth={depth + 1}
              />
            ))}
          </ul>
        </div>
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
  const navigate = useNavigate()
  const [openSections, setOpenSections] = useState<string[]>(() =>
    getActiveSectionIds(sections, pathname),
  )

  useEffect(() => {
    const activeIds = getActiveSectionIds(sections, pathname)

    if (activeIds.length === 0) {
      return
    }

    setOpenSections((current) => {
      const next = new Set(current)
      let changed = false

      for (const id of activeIds) {
        if (!next.has(id)) {
          next.add(id)
          changed = true
        }
      }

      return changed ? Array.from(next) : current
    })
  }, [pathname, sections])

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <nav
        aria-label={`${normalizedRole.toLowerCase()} navigation`}
        className="flex-1 overflow-y-auto px-4 py-5"
      >
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-2"
        >
          {sections.map((section) => {
            const SectionIcon = section.icon
            const isClickableSection = Boolean(
              section.route && !section.items.length,
            )
            const active = section.route
              ? pathname === section.route ||
                pathname.startsWith(`${section.route}/`)
              : false
            const sectionHasActiveItem = section.items.some((item) =>
              isItemActive(item, pathname),
            )

            if (isClickableSection && section.route) {
              return (
                <section key={section.id}>
                  <button
                    type="button"
                    onClick={() => void navigate({ to: section.route! })}
                    className={cn(
                      'group flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors',
                      'hover:bg-sidebar-accent/60 hover:text-white',
                      active && 'bg-sidebar-accent font-bold text-tan-accent',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {SectionIcon ? (
                      <SectionIcon
                        className={cn(
                          'size-3.5 shrink-0',
                          active ? 'text-tan-accent' : 'text-white/70',
                        )}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span>{section.title}</span>
                  </button>
                </section>
              )
            }

            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-none"
              >
                <AccordionTrigger
                  className={cn(
                    'items-center rounded-xl px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 hover:bg-sidebar-accent/60 hover:text-white hover:no-underline',
                    '[&>svg]:size-4 [&>svg]:translate-y-0 [&>svg]:text-white/70',
                    'data-[state=open]:bg-sidebar-accent data-[state=open]:text-white data-[state=open]:[&>svg]:text-white',
                    sectionHasActiveItem &&
                      'bg-sidebar-accent text-white [&>svg]:text-white',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {SectionIcon ? (
                      <SectionIcon
                        className="size-3.5 shrink-0 text-current"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span>{section.title}</span>
                  </span>
                </AccordionTrigger>
                {section.items.length ? (
                  <AccordionContent className="pb-0 pt-1">
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <SidebarNavItem
                          key={item.id}
                          item={item}
                          pathname={pathname}
                        />
                      ))}
                    </ul>
                  </AccordionContent>
                ) : null}
              </AccordionItem>
            )
          })}
        </Accordion>
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-4">
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
