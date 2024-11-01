import { hash, verify } from '@node-rs/argon2'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, username } from 'better-auth/plugins'
import type { SimplifyDeep } from 'type-fest'

import { prisma } from '~/libs/db'
import { PASSWORD_MAX, PASSWORD_MIN } from '~/services/auth.schema'

export type AuthAPI = keyof typeof auth.api
export type InferAuthOptions<API extends AuthAPI> = SimplifyDeep<Parameters<typeof auth.api[API]>[0]>
export type InferAuthResponse<API extends AuthAPI> = SimplifyDeep<Awaited<ReturnType<typeof auth.api[API]>>>

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
  // FIXME: shouldn't be hardcoded
  baseURL: 'http://localhost:3000',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN,
    maxPasswordLength: PASSWORD_MAX,
    password: {
      hash,
      verify,
    },
  },
  account: {
    // TODO: Manually Linking Accounts: https://www.better-auth.com/docs/concepts/users-accounts#manually-linking-accounts
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'discord', 'github'],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    username(),
    admin(),
  ],
})
