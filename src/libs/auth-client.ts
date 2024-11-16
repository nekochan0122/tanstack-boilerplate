import { adminClient, usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  plugins: [
    usernameClient(),
    adminClient(),
  ],
})
