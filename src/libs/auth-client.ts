import { adminClient, usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  // FIXME: shouldn't be hardcoded
  baseURL: 'http://localhost:3000',
  plugins: [
    usernameClient(),
    adminClient(),
  ],
})
