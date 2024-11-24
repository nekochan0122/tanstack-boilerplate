import type { Auth } from '~/server/session'

declare module 'vinxi/http' {
  interface H3EventContext {
    auth: Auth
  }
}
