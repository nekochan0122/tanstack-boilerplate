// http://localhost:3000/api/auth/connect/github
// https://arcticjs.dev/providers/github
// https://docs.github.com/en/rest/users/users
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes

import { GitHub } from 'arctic'
import { z } from 'zod'

import { ky } from '~/libs/ky'
import { objectKeyCamelCase } from '~/libs/utils'
import type { SocialProviderConfig } from '~/server/social'

export const githubProfileSchema = z
  .object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string().url(),
    gravatar_id: z.string().nullable(),
    url: z.string().url(),
    html_url: z.string().url(),
    followers_url: z.string().url(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string().url(),
    organizations_url: z.string().url(),
    repos_url: z.string().url(),
    events_url: z.string(),
    received_events_url: z.string().url(),
    type: z.string(),
    site_admin: z.boolean(),
    name: z.string().nullable(),
    company: z.string().nullable(),
    blog: z.string().nullable(),
    location: z.string().nullable(),
    email: z.string().email().nullable(),
    hireable: z.boolean().nullable(),
    bio: z.string().nullable(),
    twitter_username: z.string().nullable(),
    notification_email: z.string().nullable(),
    public_repos: z.number(),
    public_gists: z.number(),
    followers: z.number(),
    following: z.number(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    private_gists: z.number(),
    total_private_repos: z.number(),
    owned_private_repos: z.number(),
    disk_usage: z.number(),
    collaborators: z.number(),
    two_factor_authentication: z.boolean(),
    plan: z.object({
      name: z.string(),
      space: z.number(),
      collaborators: z.number(),
      private_repos: z.number(),
    }),
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
