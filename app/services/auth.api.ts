// TODO: error handling

import { createServerFn } from '@tanstack/start'
import { getEvent } from 'vinxi/http'
import type { z } from 'zod'

import { auth } from '~/libs/auth'
import { logger } from '~/libs/logger'
import type { Auth, signInSchema, signUpSchema } from '~/services/auth.schema'

export const getAuth = createServerFn('GET', async (): Promise<Auth> => {
  logger.info('Getting auth...')

  const event = getEvent()

  return event.context.auth
})

export const signUp = createServerFn('POST', async (input: z.infer<ReturnType<typeof signUpSchema>>, ctx) => {
  return await auth.api.signUpEmail({
    headers: ctx.request.headers,
    body: input,
    asResponse: true,
  })
})

export const signIn = createServerFn('POST', async (input: z.infer<ReturnType<typeof signInSchema>>, ctx) => {
  return await auth.api.signInUsername({
    headers: ctx.request.headers,
    body: input,
    asResponse: true,
  })
})

export const signOut = createServerFn('POST', async (_, ctx) => {
  return await auth.api.signOut({
    headers: ctx.request.headers,
    asResponse: true,
  })
})
