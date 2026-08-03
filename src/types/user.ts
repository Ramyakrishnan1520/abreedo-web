export type UserRole = 'Admin' | 'Employer' | 'Member'

export type UserStatus = 'Active' | 'Invited' | 'Suspended'

export interface User {
  id: number
  login: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}
