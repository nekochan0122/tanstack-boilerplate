// TODO: error handling

import { createServerFn } from '@tanstack/start'
import { getEvent } from 'vinxi/http'
import type { APIError } from 'better-auth/api'
import type { z } from 'zod'

import { auth } from '~/libs/auth'
import { logger } from '~/libs/logger'
import { tryCatchAsync } from '~/libs/utils'
import type { Auth } from '~/libs/auth'
import type { signInSchema, signUpSchema } from '~/services/auth.schema'

export const getAuth = createServerFn('GET', async (): Promise<Auth> => {
  logger.info('Getting auth...')

  const event = getEvent()

  return event.context.auth
})

export const signUp = createServerFn('POST', async (input: z.infer<ReturnType<typeof signUpSchema>>, ctx) => {
  const [signUpError, signUpResult] = await tryCatchAsync<APIError, Response>(
    auth.api.signUpEmail({
      headers: ctx.request.headers,
      body: input,
      asResponse: true,
    }),
  )

  if (signUpError) {
    throw new Error('TODO: error handling')
  }

  return signUpResult
})

export const signIn = createServerFn('POST', async (input: z.infer<ReturnType<typeof signInSchema>>, ctx) => {
  const [signInError, signInResult] = await tryCatchAsync<APIError, Response>(
    auth.api.signInUsername({
      headers: ctx.request.headers,
      body: input,
      asResponse: true,
    }),
  )

  if (signInError) {
    throw new Error('TODO: error handling')
  }

  return signInResult
})

export const signOut = createServerFn('POST', async (_, ctx) => {
  const [signOutError, signOutResult] = await tryCatchAsync<APIError, Response>(
    auth.api.signOut({
      headers: ctx.request.headers,
      asResponse: true,
    }),
  )

  if (signOutError) {
    throw new Error('TODO: error handling')
  }

  return signOutResult
})
