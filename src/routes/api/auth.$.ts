import { createAPIFileRoute } from '@tanstack/start/api'
import type { StartAPIMethodCallback } from '@tanstack/start/api'

import { auth } from '~/libs/auth'

export const Route = createAPIFileRoute('/api/auth/$')({
  GET: createAuthHandler(),
  POST: createAuthHandler(),
})

const allowedPaths = [
  /^\/api\/auth\/sign-in\/social$/,
  /^\/api\/auth\/callback\/.+$/,
]

function createAuthHandler() {
  const authHandler: StartAPIMethodCallback<'/api/auth/$'> = ({ request }) => {
    const path = new URL(request.url).pathname

    const isAllowed = allowedPaths.some((regExp) => regExp.test(path))

    if (!isAllowed) {
      return new Response('Not allowed', {
        status: 403,
      })
    }

    return auth.handler(request)
  }

  return authHandler
}
