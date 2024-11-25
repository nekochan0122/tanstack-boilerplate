// TODO: i18n
// TODO: error handling - https://github.com/TanStack/router/issues/2535

import { createServerFn } from '@tanstack/start'
import { zodValidator } from '@tanstack/zod-adapter'

import { VerificationEmail } from '~/emails/verification-email'
import { authMiddleware } from '~/middlewares/auth'
import { prisma } from '~/server/db'
import { sendEmail } from '~/server/email'
import { hashPassword, verifyPassword } from '~/server/password'
import { createSession, deleteSessionTokenCookie, generateSessionToken, getSessionTokenCookie, invalidateSession, setSessionTokenCookie, validateSessionToken } from '~/server/session'
import { createVerification } from '~/server/verification'
import { signInSchema, signUpSchema } from '~/services/auth.schema'

export const getAuth = createServerFn({ method: 'GET' })
  .handler(async () => {
    const token = getSessionTokenCookie()
    const auth = await validateSessionToken(token)
    if (token && auth.isAuthenticated) {
      setSessionTokenCookie(token, auth.session.expiresAt)
    }
    else {
      deleteSessionTokenCookie()
    }

    return auth
  })

export const signUp = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(zodValidator(signUpSchema()))
  .handler(async ({ context, data }) => {
    if (context.auth.isAuthenticated) {
      throw new Error('Already authenticated')
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email },
        ],
      },
    })

    if (existingUser) {
      if (existingUser.username === data.username) {
        throw new Error('Username already exists')
      }

      if (existingUser.email === data.email) {
        throw new Error('Email already exists')
      }
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        hashedPassword: await hashPassword(data.password),
      },
    })

    const emailVerification = await createVerification(
      'EMAIL_VERIFICATION',
      user.id,
      user.email,
    )

    sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      react: VerificationEmail({ code: emailVerification.code }),
    })

    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, user.id)

    setSessionTokenCookie(sessionToken, session.expiresAt)
  })

export const signInUsername = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(zodValidator(signInSchema()))
  .handler(async ({ context, data }) => {
    if (context.auth.isAuthenticated) {
      throw new Error('Already authenticated')
    }

    const user = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
      include: {
        accounts: true,
      },
    })

    if (user === null) {
      throw new Error('Username or password is incorrect')
    }

    const isPasswordValid = await verifyPassword(user.hashedPassword, data.password)
    if (isPasswordValid === false) {
      throw new Error('Username or password is incorrect')
    }

    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, user.id)

    setSessionTokenCookie(sessionToken, session.expiresAt)
  })

export const signOut = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (context.auth.isAuthenticated) {
      await invalidateSession(context.auth.session.id)
      deleteSessionTokenCookie()
    }
  })
