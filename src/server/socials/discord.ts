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
    username: z.string(), // User's username (not unique)
    discriminator: z.string(), // User's Discord tag
    global_name: z.string().optional(), // Display name if set
    avatar: z.string().optional(), // Avatar hash
    verified: z.boolean(), // Email verified
    email: z.string(), // User's email
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

    let imageUrl: string
    if (profile.avatar === undefined) {
      const defaultAvatarNumber = profile.discriminator === '0'
        ? Number(BigInt(profile.id) >> BigInt(22)) % 6
        : parseInt(profile.discriminator) % 5
      imageUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
    }
    else {
      const format = profile.avatar.startsWith('a_') ? 'gif' : 'png'
      imageUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
    }

    return {
      id: profile.id,
      name: profile.globalName || profile.username,
      email: profile.email,
      emailVerified: profile.verified,
      image: imageUrl,
    }
  },
} satisfies SocialProviderConfig
