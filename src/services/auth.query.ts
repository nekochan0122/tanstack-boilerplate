import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'
import type { LiteralUnion } from 'type-fest'

import { authClient } from '~/libs/auth-client'
import { getAuth, signIn, signOut, signUp } from '~/services/auth.api'
import type { InternalLink } from '~/components/ui/link'
import type { SupportedSocialProviderId } from '~/config/social-provider'
import type { Authed } from '~/libs/auth'

export const authKeys = {
  getAuth: () => ['getAuth'],
}

export const getAuthQueryOptions = () => {
  return queryOptions({
    queryKey: authKeys.getAuth(),
    queryFn: () => getAuth(),
  })
}

export const useAuthQuery = () => {
  return useSuspenseQuery(getAuthQueryOptions())
}

export const useAuthedQuery = () => {
  const authQuery = useAuthQuery()

  if (authQuery.data.isAuthenticated === false) {
    throw new Error('Not authenticated')
  }

  return authQuery as UseSuspenseQueryResult<Authed>
}

export type InvalidateOptions = {
  callbackURL?: LiteralUnion<InternalLink, string>
}

export const useAuthInvalidate = (invalidateOptions?: InvalidateOptions) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  async function invalidate() {
    await queryClient.invalidateQueries(getAuthQueryOptions())

    if (invalidateOptions?.callbackURL) {
      await router.navigate({ to: invalidateOptions?.callbackURL })
    }

    await router.invalidate()
  }

  return invalidate
}

export const useSignUpMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate(invalidateOptions)

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: invalidateAuth,
  })

  return signUpMutation
}

export const useSignInMutation = (invalidateOptions?: InvalidateOptions) => {
  const invalidateAuth = useAuthInvalidate(invalidateOptions)

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: invalidateAuth,
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
  const invalidateAuth = useAuthInvalidate(invalidateOptions)

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: invalidateAuth,
  })

  return signOutMutation
}
