import type { ComponentType, SVGProps } from 'react'
import type { AppRoute } from '#/static/routes.ts'

export type NavigationRole = 'ADMIN' | 'EMPLOYEE'

export type NavigationRoleInput =
  | NavigationRole
  | 'admin'
  | 'employee'
  | 'employer'

export interface SidebarItem {
  id: string
  title: string
  route: AppRoute
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  children?: SidebarItem[]
}

export interface SidebarSection {
  id: string
  title: string
  items: SidebarItem[]
}

export interface HeaderMenu {
  id: string
  label: string
  href: string
  children?: HeaderMenu[]
}
