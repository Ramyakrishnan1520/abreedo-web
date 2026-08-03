import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type {
  AuthTokenResponse,
  AuthUser,
  LoginInput,
  StoredTokens,
} from '#/types/auth.ts'

export interface AuthStoreState {
  user: AuthUser | null
  tokens: StoredTokens | null
  login: (input: LoginInput) => AuthUser
  setTokens: (tokens: AuthTokenResponse) => void
  setStoredTokens: (tokens: StoredTokens) => void
  logout: () => void
}

export const AUTH_STORE_KEY = 'abreedo.auth'

function clearStoredAuthState() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORE_KEY)
  window.sessionStorage.removeItem(AUTH_STORE_KEY)
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,

      login: (input) => {
        const user = {
          id: input.id,
          name: input.name,
          email: input.email,
          role: input.role,
        }

        set({ user })
        return user
      },

      setTokens: (tokens) => {
        set({
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: Date.now() + tokens.expiresInSeconds * 1000,
          },
        })
      },

      setStoredTokens: (tokens) => {
        set({ tokens })
      },

      logout: () => {
        set({ user: null, tokens: null })
        clearStoredAuthState()
      },
    }),
    {
      name: AUTH_STORE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
      }),
    },
  ),
)

export type AuthStore = typeof useAuthStore
