import type { Auth } from '~/services/auth.schema'

declare module 'vinxi/http' {
  interface H3EventContext {
    auth: Auth
  }
}
