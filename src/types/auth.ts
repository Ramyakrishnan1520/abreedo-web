import type { UserRole } from '#/enums/user-role.ts'

export type { UserRole } from '#/enums/user-role.ts'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginInput {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
}

export interface StoredTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface MeResponse {
  userAccessId: string
  login: string
  role: string
  isAdmin: boolean
  employerId: string
}
