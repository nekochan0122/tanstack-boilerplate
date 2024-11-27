import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'

import { getAuth } from '~/services/auth.api'
import type { Auth } from '~/services/auth.api'

export const authQueryOptions = () => queryOptions({
  queryKey: ['getAuth'],
  queryFn: () => getAuth(),
})

export const useAuthQuery = () => {
  return useSuspenseQuery(authQueryOptions())
}

export const useAuthedQuery = () => {
  const authQuery = useAuthQuery()

  if (authQuery.data.isAuthenticated === false) {
    throw new Error('Not authenticated')
  }

  return authQuery as UseSuspenseQueryResult<Extract<Auth, { isAuthenticated: true }>>
}
