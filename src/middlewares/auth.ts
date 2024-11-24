import { Role } from '@prisma/client'
import { createMiddleware } from '@tanstack/start'
import { status } from 'http-status'
import { setResponseStatus } from 'vinxi/http'

import { deleteSessionTokenCookie, getSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from '~/server/session'
import type { Auth } from '~/server/session'

export const authMiddleware = createMiddleware()
  .server(async ({ next }) => {
    const token = getSessionTokenCookie()
    const auth = await validateSessionToken(token)
    if (token && auth.isAuthenticated) {
      setSessionTokenCookie(token, auth.session.expiresAt)
    }
    else {
      deleteSessionTokenCookie()
    }

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
