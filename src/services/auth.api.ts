import { createServerFn } from '@tanstack/start'
import { getEvent } from 'vinxi/http'
import type { Simplify } from 'type-fest'

import type { Session } from '~/server/auth'

export interface Authenticated extends Session {
  isAuthenticated: true
}

export interface Unauthenticated {
  isAuthenticated: false
}

export type Auth = Simplify<Authenticated | Unauthenticated>

export const getAuth = createServerFn({ method: 'GET' })
  .handler<Auth>(async () => {
    const event = getEvent()

    return event.context.auth
  })
