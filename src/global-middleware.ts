import { status } from 'http-status'
import { defineMiddleware } from 'vinxi/http'

export default defineMiddleware({
  onRequest: async (event) => {
    // CSRF Protection
    if (event.method !== 'GET') {
      const appOrigin = new URL(import.meta.env.VITE_APP_BASE_URL).origin
      const requestOrigin = event.headers.get('origin')
      if (requestOrigin === null || requestOrigin !== appOrigin) {
        return event.respondWith(
          new Response('Forbidden', {
            status: status.FORBIDDEN,
          }),
        )
      }
    }
  },
})
