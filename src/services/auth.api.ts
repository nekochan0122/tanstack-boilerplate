// TODO: error handling - https://github.com/TanStack/router/issues/2535
// FIXME: return raw response - https://github.com/TanStack/router/issues/2779

import { createServerFn } from '@tanstack/start'
import { getEvent, getWebRequest, setHeaders } from 'vinxi/http'
import type { APIError } from 'better-auth/api'

import { auth, authSchema } from '~/libs/auth'
import { logger } from '~/libs/logger'
import { tryCatchAsync } from '~/libs/utils'
import { handleZodErrors } from '~/libs/zod'
import { signInSchema, signUpSchema } from '~/services/auth.schema'
import type { InferAuthResult } from '~/libs/auth'

async function handleResponse<ResponseBody = unknown>(response: Response): Promise<ResponseBody> {
  const event = getEvent()

  setHeaders(event, Object.fromEntries(response.headers))

  switch (response.headers.get('Content-Type')) {
    case 'application/json':
      return await response.json() as ResponseBody

    default:
      return response.body as ResponseBody
  }
}

export const getAuth = createServerFn({ method: 'GET' })
  .handler(async () => {
    logger.info('Getting auth...')

    const request = getWebRequest()

    const authSession = await auth.api.getSession({
      headers: request.headers,
    })

    const authResult = await authSchema.safeParseAsync(
      authSession === null
        ? { isAuthenticated: false, user: null, session: null }
        : { isAuthenticated: true, user: authSession.user, session: authSession.session },
    )

    if (authResult.error) {
      handleZodErrors(authResult.error)

      throw new Error('Unexpected auth schema')
    }

    return authResult.data
  })

export const signUp = createServerFn({ method: 'POST' })
  .validator(signUpSchema())
  .handler(async ({ data }) => {
    const request = getWebRequest()

    const [signUpError, signUpResponse] = await tryCatchAsync<APIError, Response>(
      auth.api.signUpEmail({
        headers: request.headers,
        body: data,
        asResponse: true,
      }),
    )

    if (signUpError) {
      throw new Error('TODO: error handling')
    }

    return await handleResponse<InferAuthResult<'signUpEmail'>>(signUpResponse)
  })

export const signIn = createServerFn({ method: 'POST' })
  .validator(signInSchema())
  .handler(async ({ data }) => {
    const request = getWebRequest()

    const [signInError, signInResponse] = await tryCatchAsync<APIError, Response>(
      auth.api.signInUsername({
        headers: request.headers,
        body: data,
        asResponse: true,
      }),
    )

    if (signInError) {
      throw new Error('TODO: error handling')
    }

    return await handleResponse<InferAuthResult<'signInUsername'>>(signInResponse)
  })

export const signOut = createServerFn({ method: 'POST' })
  .handler(async () => {
    const request = getWebRequest()

    const [signOutError, signOutResponse] = await tryCatchAsync<APIError, Response>(
      auth.api.signOut({
        headers: request.headers,
        asResponse: true,
      }),
    )

    if (signOutError) {
      throw new Error('TODO: error handling')
    }

    return await handleResponse<InferAuthResult<'signOut'>>(signOutResponse)
  })
