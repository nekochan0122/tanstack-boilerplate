import type { Auth } from '~/libs/auth'

declare module 'vinxi/http' {
  interface H3EventContext {
    auth: Auth
  }
}
