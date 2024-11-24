// http://localhost:3000/api/auth/connect/discord
// https://arcticjs.dev/providers/discord
// https://discord.com/developers/docs/resources/user#user-object

import { Discord } from 'arctic'
import { z } from 'zod'

import { ky } from '~/libs/ky'
import { objectKeyCamelCase } from '~/libs/utils'
import type { SocialProviderConfig } from '~/server/social'

export const discordProfileSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    global_name: z.string().nullable(),
  })
  .transform(objectKeyCamelCase)

export const discordConfig = {
  arcticInstance: new Discord(
    process.env.DISCORD_CLIENT_ID,
    process.env.DISCORD_CLIENT_SECRET,
    `${import.meta.env.VITE_APP_BASE_URL}/api/auth/callback/discord`,
  ),
  requiresPKCE: false,
  scopes: ['identify', 'email'],
  getProfile: async (tokens) => {
    const profile = await ky
      .get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      })
      .json()
      .then(discordProfileSchema.parse)

    return {
      id: profile.id,
      name: profile.globalName || profile.username,
    }
  },
} satisfies SocialProviderConfig
