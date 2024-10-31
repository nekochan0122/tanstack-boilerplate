import { createAPIFileRoute } from '@tanstack/start/api'

import { auth } from '~/libs/auth'

export const Route = createAPIFileRoute('/api/auth/$')({
  GET: ({ request }) => auth.handler(request),
  POST: ({ request }) => auth.handler(request),
})
