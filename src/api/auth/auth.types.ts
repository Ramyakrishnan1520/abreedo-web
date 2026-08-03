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
  expiresAt: number // unix ms when access token expires
}

export interface MeResponse {
  userAccessId: string
  login: string
  role: string
  isAdmin: boolean
  employerId: string
}
