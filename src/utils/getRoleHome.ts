import { UserRole } from '#/enums/user-role.ts'
import { ROUTES } from '#/static/routes.ts'

import type { AppRoute } from '#/static/routes.ts'

export function getRoleHome(role: UserRole): AppRoute {
  return role === UserRole.Admin ? ROUTES.ADMIN_USERS : ROUTES.EMPLOYEE_ROOT
}
