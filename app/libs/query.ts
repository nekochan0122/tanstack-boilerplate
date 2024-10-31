import { QueryClient } from '@tanstack/react-query'
import { lazy } from 'react'

export function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })

  return queryClient
}

export const QueryDevtools = import.meta.env.PROD ? () => null : lazy(() =>
  import('@tanstack/react-query-devtools').then((res) => ({
    default: res.ReactQueryDevtools,
  })),
)
