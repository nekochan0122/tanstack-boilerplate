import { hash, verify } from '@node-rs/argon2'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { createEmailVerificationToken } from 'better-auth/api'
import { admin, username } from 'better-auth/plugins'
import { z } from 'zod'
import type { Except, SimplifyDeep, UnknownRecord } from 'type-fest'

import { VerificationEmail } from '~/emails/verification-email'
import { prisma } from '~/libs/db'
import { sendEmail } from '~/libs/email'
import { PASSWORD_MAX, PASSWORD_MIN } from '~/services/auth.schema'
import type { InferZodObjectShape } from '~/libs/zod'

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: PASSWORD_MIN,
    maxPasswordLength: PASSWORD_MAX,
    password: {
      hash,
      verify,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: i18n
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        react: VerificationEmail({ url }),
      })
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
      // TODO: i18n
        await sendEmail({
          to: newEmail,
          subject: 'Verify your new email address',
          react: VerificationEmail({ url }),
        })
      },
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

export const createEmailVerifyToken = (email: string, newEmail?: string) => {
  return createEmailVerificationToken(
    process.env.AUTH_SECRET,
    email,
    newEmail,
  )
}

export const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    username: z.string().nullable(),
    role: z.enum(['user', 'admin']),
    banned: z.boolean().nullable(),
    banReason: z.string().nullable(),
    banExpires: z.date().nullable(),
  })
  .strict()

export const sessionSchema = z
  .object({
    id: z.string(),
    expiresAt: z.date(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    userId: z.string(),
    impersonatedBy: z.string().nullable(),
  })
  .strict()

export const authSchema = z
  .discriminatedUnion('isAuthenticated', [
    z.object({
      isAuthenticated: z.literal(false),
      user: z.null(),
      session: z.null(),
    }),
    z.object({
      isAuthenticated: z.literal(true),
      user: userSchema,
      session: sessionSchema,
    }),
  ])

export type Auth = z.infer<typeof authSchema>
export type Authed = Extract<Auth, { isAuthenticated: true }>

export type AuthAPI = keyof typeof auth.api
export type InferAuthResult<API extends AuthAPI> = SimplifyDeep<Awaited<ReturnType<typeof auth.api[API]>>>
export type InferAuthOptions<API extends AuthAPI> = SimplifyDeep<NonNullable<Parameters<typeof auth.api[API]>[0]>>

// TODO: refactor, move except to generics
export type InferAuthAPIZodShape<API extends AuthAPI> =
  InferAuthOptions<API> extends { body: UnknownRecord }
    ? InferZodObjectShape<Except<InferAuthOptions<API>['body'], 'callbackURL' | 'image'>>
    : InferAuthOptions<API> extends { query: UnknownRecord }
      ? InferZodObjectShape<Except<InferAuthOptions<API>['query'], 'callbackURL' | 'image'>>
      : never
