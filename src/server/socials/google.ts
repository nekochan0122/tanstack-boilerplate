// http://localhost:3000/api/auth/connect/google
// https://arcticjs.dev/providers/google
// https://developers.google.com/identity/protocols/oauth2/scopes

import { decodeIdToken, Google } from 'arctic'
import { z } from 'zod'

import { objectKeyCamelCase } from '~/libs/utils'
import type { SocialProviderConfig } from '~/server/social'

export const googleProfileSchema = z
  .object({
    name: z.string(), // User's full name
    sub: z.string(), // Subject identifier (unique to Google accounts)
  })
  .transform(objectKeyCamelCase)

export const googleConfig = {
  arcticInstance: new Google(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${import.meta.env.VITE_APP_BASE_URL}/api/auth/callback/google`,

  ),
  requiresPKCE: true,
  scopes: ['openid', 'profile'],
  getProfile: async (tokens) => {
    const claims = decodeIdToken(tokens.idToken())
    const profile = googleProfileSchema.parse(claims)

    return {
      id: profile.sub,
      name: profile.name,
    }
  },
} satisfies SocialProviderConfig
