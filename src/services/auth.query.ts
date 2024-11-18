import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'
import type { LiteralUnion } from 'type-fest'

import { authClient } from '~/libs/auth-client'
import { getAuth, signIn, signOut, signUp } from '~/services/auth.api'
import type { ValidLink } from '~/components/ui/link'
import type { SupportedSocialProviderId } from '~/config/social-provider'
import type { Authed } from '~/libs/auth'

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

  return authQuery as UseSuspenseQueryResult<Authed>
}

export type InvalidateOptions = {
  callbackURL?: LiteralUnion<ValidLink, string>
}

export const useAuthInvalidate = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  function invalidate(invalidateOptions?: InvalidateOptions) {
    return async () => {
      await queryClient.invalidateQueries(authQueryOptions())

      if (invalidateOptions?.callbackURL) {
        console.log(' ===== callbackURL ===== ', invalidateOptions.callbackURL)
        await router.navigate({ to: invalidateOptions?.callbackURL })
      }

      await router.invalidate()
    }
  }

  return invalidate
}

export const useSignUpMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate()

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: invalidateAuth(invalidateOptions),
  })

  return signUpMutation
}

export const useSignInMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate()

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: invalidateAuth(invalidateOptions),
  })

  return signInMutation
}

export const useSignInSocialMutation = () => {
  const signInMutation = useMutation({
    mutationFn: ({
      provider,
      callbackURL,
    }: {
      provider: SupportedSocialProviderId
      callbackURL: string
    }) => {
      return authClient.signIn.social({ provider, callbackURL })
    },
  })

  return signInMutation
}

export const useSignOutMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate()

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: invalidateAuth(invalidateOptions),
  })

  return signOutMutation
}
