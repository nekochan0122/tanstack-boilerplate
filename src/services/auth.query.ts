import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'
import type { LiteralUnion } from 'type-fest'

import { getAuth, signInUsername, signOut, signUp } from '~/services/auth.api'
import type { ValidLink } from '~/components/ui/link'
import type { Auth } from '~/server/session'

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

export type InvalidateOptions = {
  callbackURL?: LiteralUnion<ValidLink, string>
}

export const useAuthInvalidate = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return function invalidate(invalidateOptions?: InvalidateOptions) {
    return async () => {
      await queryClient.invalidateQueries(authQueryOptions())

      if (invalidateOptions?.callbackURL) {
        await router.navigate({ to: invalidateOptions.callbackURL })
      }

      await router.invalidate()
    }
  }
}

export const useSignUpMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: signUp,
    onSuccess: invalidateAuth(invalidateOptions),
  })
}

export const useSignInMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: signInUsername,
    onSuccess: invalidateAuth(invalidateOptions),
  })
}

export const useSignOutMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate()

  return useMutation({
    mutationFn: signOut,
    onSuccess: invalidateAuth(invalidateOptions),
  })
}
