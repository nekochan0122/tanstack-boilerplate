import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { lazy } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import type { useRouteContext } from '@tanstack/react-router'

import { createQueryClient } from '~/libs/query'
import { routeTree } from '~/route-tree.gen'
import type { FileRouteTypes } from '~/route-tree.gen'

export type InferRouteContext<Route extends FileRouteTypes['to']> =
  ReturnType<typeof useRouteContext<typeof routeTree, Route>>

export type RouterContext = {
  queryClient: QueryClient
}

export function createRouter() {
  const queryClient = createQueryClient()

  const routerContext: RouterContext = {
    queryClient,
  }

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: routerContext,
      search: {
        strict: true,
      },
      defaultPreload: 'intent',
    }),
    queryClient,
  )
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

export const RouterDevtools = import.meta.env.PROD ? () => null : lazy(() =>
  import('@tanstack/react-router-devtools').then((res) => ({
    default: res.TanStackRouterDevtools,
  })),
)
