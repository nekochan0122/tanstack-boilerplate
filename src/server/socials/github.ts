// http://localhost:3000/api/auth/connect/github
// https://arcticjs.dev/providers/github
// https://docs.github.com/en/rest/users/users
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes

import { GitHub } from 'arctic'
import { z } from 'zod'

import { ky } from '~/libs/ky'
import type { SocialProviderConfig } from '~/server/social'

export const githubProfileSchema = z
  .object({
    id: z.number(),
    login: z.string(),
    name: z.string().nullable(),
  })

export const githubEmailsSchema = z.array(
  z.object({
    email: z.string(), // Email address
    primary: z.boolean(), // Whether this email is the primary email
    verified: z.boolean(), // Whether this email is verified
  }),
)

export const githubConfig = {
  arcticInstance: new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
    `${import.meta.env.VITE_APP_BASE_URL}/api/auth/callback/github`,
  ),
  requiresPKCE: false,
  scopes: ['read:user'],
  getProfile: async (tokens) => {
    const profile = await ky
      .get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      })
      .json()
      .then(githubProfileSchema.parse)

    return {
      id: profile.id.toString(),
      name: profile.name || profile.login,
    }
  },
} satisfies SocialProviderConfig
