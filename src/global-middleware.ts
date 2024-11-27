import { defineMiddleware } from 'vinxi/http'

import { auth } from '~/server/auth'

export default defineMiddleware({
  onRequest: async (event) => {
    const session = await auth.api.getSession({
      headers: event.headers,
    })

    event.context.auth = session !== null
      ? { isAuthenticated: true, ...session }
      : { isAuthenticated: false }
  },
})
