// http://localhost:3000/api/auth/connect/github
// https://arcticjs.dev/providers/github
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes

import { GitHub } from 'arctic'
import { z } from 'zod'

import { ky } from '~/libs/ky'
import { objectKeyCamelCase } from '~/libs/utils'
import type { SocialProviderConfig } from '~/server/social'

export const githubProfileSchema = z
  .object({
    login: z.string(), // GitHub username
    id: z.number(), // User's unique ID
    avatar_url: z.string(), // Avatar URL
    type: z.string(), // Type of user (User or Organization)
    name: z.string(), // User's full name
    email: z.string().nullable(), // User's email
    created_at: z.string(), // Account creation date
    updated_at: z.string(), // Last account update date
  })
  .transform(objectKeyCamelCase)

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
  scopes: ['user:email'],
  getProfile: async (tokens) => {
    const profile = await ky
      .get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      })
      .json()
      .then(githubProfileSchema.parse)

    const emails = await ky
      .get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      })
      .json()
      .then(githubEmailsSchema.parse)

    const email = profile.email || emails.find((e) => e.primary)!.email
    const emailVerified = emails.find((e) => e.email === email)!.verified

    return {
      id: profile.id.toString(),
      name: profile.name || profile.login,
      email: email,
      emailVerified: emailVerified,
      image: profile.avatarUrl,
    }
  },
} satisfies SocialProviderConfig
