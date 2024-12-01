import { createServerFn } from '@tanstack/start'
import { getEvent } from 'vinxi/http'

import type { Session } from '~/server/auth'

interface Authenticated extends Session {
  isAuthenticated: true
}

interface Unauthenticated {
  isAuthenticated: false
}

export type Auth = Authenticated | Unauthenticated

export const getAuth = createServerFn({ method: 'GET' })
  .handler<Auth>(async () => {
    const event = getEvent()

    return event.context.auth
  })
