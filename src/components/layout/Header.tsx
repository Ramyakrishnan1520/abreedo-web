import { cn } from '#/lib/utils.ts'
import type { NavigationRoleInput } from '#/types/navigation.ts'

interface HeaderProps {
  userName: string
  companyName: string
  role: NavigationRoleInput
  className?: string
}

function getRoleLabel(role: NavigationRoleInput) {
  return role.toString().toLowerCase() === 'admin'
    ? 'Administrator'
    : 'Employee'
}

export function Header({
  userName,
  companyName,
  role,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80',
        className,
      )}
    >
      <div className="mx-auto flex h-20 items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-lg font-bold text-white shadow-md">
            AM
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              ABREEDO
            </h1>

            <p className="text-sm text-slate-500">{companyName}</p>
          </div>
        </div>

        {/* Right */}
        <div className="hidden text-right md:block">
          <p className="text-xs text-slate-500">Welcome back</p>

          <h2 className="font-semibold text-slate-900">{userName}</h2>

          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {getRoleLabel(role)}
          </span>
        </div>
      </div>
    </header>
  )
}
