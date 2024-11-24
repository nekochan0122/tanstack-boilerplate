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
    discriminator: z.string(),
    global_name: z.string().nullable(),
    avatar: z.string().nullable(),
    bot: z.boolean().optional(),
    system: z.boolean().optional(),
    mfa_enabled: z.boolean().optional(),
    banner: z.string().nullable().optional(),
    accent_color: z.number().nullable().optional(),
    locale: z.string().optional(),
    verified: z.boolean().optional(),
    email: z.string().optional(),
    flags: z.number().optional(),
    premium_type: z.number().optional(),
    public_flags: z.number().optional(),
    avatar_decoration_data: z
      .object({
        asset: z.string(),
        sku_id: z.string(),
      })
      .nullable()
      .optional(),
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
