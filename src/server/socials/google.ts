// http://localhost:3000/api/auth/connect/google
// https://arcticjs.dev/providers/google
// https://developers.google.com/identity/protocols/oauth2/scopes

import { decodeIdToken, Google } from 'arctic'
import { z } from 'zod'

import { objectKeyCamelCase } from '~/libs/utils'
import type { SocialProviderConfig } from '~/server/social'

export const googleProfileSchema = z
  .object({
    aud: z.string(), // Audience the ID token is intended for
    azp: z.string(), // Authorized party
    name: z.string(), // User's full name
    given_name: z.string(), // User's given (first) name
    family_name: z.string(), // User's family (last) name
    picture: z.string(), // URL to the user's profile picture
    sub: z.string(), // Subject identifier (unique to Google accounts)
    iss: z.string(), // Issuer identifier
    iat: z.number(), // Issued at timestamp
    exp: z.number(), // Expiration timestamp
    nbf: z.number().optional(), // Not-before timestamp
    hd: z.string().optional(), // Hosted domain (if applicable)
    locale: z.string().optional(), // User's locale preference
    jti: z.string().optional(), // Token identifier
    at_hash: z.string().optional(), // Hash of the ID token
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
