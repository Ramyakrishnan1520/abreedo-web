import { Outlet } from '@tanstack/react-router'

export function UnauthenticatedLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
