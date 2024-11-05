import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'

import { authClient } from '~/libs/auth-client'
import { getAuth, signIn, signOut, signUp } from '~/services/auth.api'
import type { SupportedOAuthProviderId } from '~/config/oauth'
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

export const useInvalidateAuth = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  async function invalidateAuth() {
    await queryClient.invalidateQueries(getAuthQueryOptions())
    await router.invalidate()
  }

  return invalidateAuth
}

export const useSignUpMutation = () => {
  const invalidateAuth = useInvalidateAuth()

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: invalidateAuth,
  })

  return signUpMutation
}

export const useSignInMutation = () => {
  const invalidateAuth = useInvalidateAuth()

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: invalidateAuth,
  })

  return signInMutation
}

export const useSignInOAuthMutation = () => {
  const signInMutation = useMutation({
    mutationFn: ({
      provider,
      callbackURL,
    }: {
      provider: SupportedOAuthProviderId
      callbackURL: string
    }) => {
      return authClient.signIn.social({ provider, callbackURL })
    },
  })

  return signInMutation
}

export const useSignOutMutation = () => {
  const invalidateAuth = useInvalidateAuth()

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: invalidateAuth,
  })

  return signOutMutation
}
