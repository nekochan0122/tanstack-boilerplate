import { defineMiddleware } from 'vinxi/http'

import { auth } from '~/libs/auth'
import { handleZodErrors } from '~/libs/zod'
import { authSchema } from '~/services/auth.schema'

export default defineMiddleware({
  onRequest: async (event) => {
    const authSession = await auth.api.getSession({
      headers: event.headers,
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

    event.context.auth = authResult.data
  },
})
