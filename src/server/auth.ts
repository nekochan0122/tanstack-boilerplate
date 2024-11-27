// FIXME: https://discord.com/channels/1288403910284935179/1288403910284935182/1311200136923185173

import { hash, verify } from '@node-rs/argon2'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { APIError } from 'better-auth/api'
import { admin, username } from 'better-auth/plugins'
import type { BetterAuthPlugin } from 'better-auth'

import { VerificationEmail } from '~/emails/verification-email'
import { prisma } from '~/server/db'
import { sendEmail } from '~/server/email'
import { PASSWORD_MAX, PASSWORD_MIN, passwordSchema } from '~/services/auth.schema'

export const auth = betterAuth({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  secret: process.env.AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
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
      sendEmail({
        to: user.email,
        // TODO: i18n
        subject: 'Verify your email address',
        react: VerificationEmail({ url }),
      })
    },
  },
  user: {
    modelName: 'User',
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        sendEmail({
          to: newEmail,
          // TODO: i18n
          subject: 'Verify your new email address',
          react: VerificationEmail({ url }),
        })
      },
    },
  },
  session: {
    modelName: 'Session',
  },
  account: {
    modelName: 'Account',
    // TODO: Manually Linking Accounts: https://www.better-auth.com/docs/concepts/users-accounts#manually-linking-accounts
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'discord', 'github'],
    },
  },
  verification: {
    modelName: 'Verification',
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
    passwordValidator(),
  ],
})

function passwordValidator() {
  return {
    id: 'password-validator',
    hooks: {
      before: [
        {
          matcher: (ctx) => ctx.body?.password,
          handler: async (ctx) => {
            const passwordParseResult = passwordSchema().safeParse(ctx.body.password)

            if (passwordParseResult.error) {
              throw new APIError('BAD_REQUEST', {
                message: 'Invalid password',
              })
            }
          },
        },
      ],
    },
  } as const satisfies BetterAuthPlugin
}
