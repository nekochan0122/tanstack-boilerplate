import type { createRouter } from '~/libs/router'

type Router = ReturnType<typeof createRouter>
type QueryClient = Router['options']['context']['queryClient']

declare global {
  interface Window {
    getRouter: () => Router
    getQueryClient: () => QueryClient
  }
}
