import { createRouter as createTanStackRouter, isRedirect } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { lazy } from 'react'
import type { QueryClient } from '@tanstack/react-query'

import { createQueryClient } from '~/libs/query'
import { routeTree } from '~/route-tree.gen'

export type RouterContext = {
  queryClient: QueryClient
}

export function createRouter() {
  const queryClient = createQueryClient()

  const routerContext: RouterContext = {
    queryClient,
  }

  const router = createTanStackRouter({
    routeTree,
    context: routerContext,
    search: {
      strict: true,
    },
    defaultPreload: false,
  })

  // handle redirect without useServerFn when using tanstack query
  queryClient.getQueryCache().config.onError = handleRedirectError
  queryClient.getMutationCache().config.onError = handleRedirectError

  function handleRedirectError(error: Error) {
    if (isRedirect(error)) {
      router.navigate(
        router.resolveRedirect({
          ...error,
          _fromLocation: router.state.location,
        }),
      )
    }
  }

  return routerWithQueryClient(router, queryClient)
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

export const RouterDevtools = import.meta.env.PROD ? () => null : lazy(() =>
  import('@tanstack/react-router-devtools').then((mod) => ({
    default: mod.TanStackRouterDevtools,
  })),
)
