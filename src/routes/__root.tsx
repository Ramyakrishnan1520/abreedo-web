import { createRootRouteWithContext } from '@tanstack/react-router'

import { RootRouteComponent } from '#/components/layouts/RootRouteComponent.tsx'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { AuthStore } from '#/features/auth/auth.tsx'

interface MyRouterContext {
  auth: AuthStore
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'ABREEDO',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootRouteComponent,
})
