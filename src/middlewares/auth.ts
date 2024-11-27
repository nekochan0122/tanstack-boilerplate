import { createMiddleware } from '@tanstack/start'
import { status } from 'http-status'
import { setResponseStatus } from 'vinxi/http'

import { getAuth } from '~/services/auth.api'
import type { Auth } from '~/services/auth.api'

export const authMiddleware = createMiddleware()
  .server(async ({ next }) => {
    const auth = await getAuth()

    return next({
      context: {
        auth,
      },
    })
  })

export const authedMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.auth.isAuthenticated === false) {
      setResponseStatus(status.UNAUTHORIZED)
      throw new Error('Unauthorized')
    }

    return next({
      context: {
        auth: context.auth as Auth,
      },
    })
  })

export const adminMiddleware = createMiddleware()
  .middleware([authedMiddleware])
  .server(async ({ next, context }) => {
    // @ts-expect-error https://github.com/TanStack/router/issues/2780
    if (context.auth.user.role !== Role.Admin) {
      setResponseStatus(status.UNAUTHORIZED)
      throw new Error('Unauthorized')
    }

    return next({
      context: {
        auth: context.auth,
      },
    })
  })
