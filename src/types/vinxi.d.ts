import type { Auth } from '~/services/auth.api'

declare module 'vinxi/http' {
  interface H3EventContext {
    auth: Auth
  }
}
