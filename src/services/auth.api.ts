import { createServerFn } from '@tanstack/start'
import { getEvent } from 'vinxi/http'

import type { auth } from '~/server/auth'

export type Auth =
  | { isAuthenticated: true } & typeof auth.$Infer.Session
  | { isAuthenticated: false }

export const getAuth = createServerFn({ method: 'GET' })
  .handler<Auth>(async () => {
    const event = getEvent()

    return event.context.auth
  })
