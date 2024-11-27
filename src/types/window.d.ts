import type { createRouter } from '~/router'

type Router = ReturnType<typeof createRouter>
type QueryClient = Router['options']['context']['queryClient']

declare global {
  interface Window {
    getRouter: () => Router
    getQueryClient: () => QueryClient
  }
}
