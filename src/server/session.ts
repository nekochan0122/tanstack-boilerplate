import { sha256 } from '@oslojs/crypto/sha2'
import { encodeHexLowerCase } from '@oslojs/encoding'
import { omit } from 'es-toolkit'
import { deleteCookie, getCookie, setCookie } from 'vinxi/http'
import type { Session, User } from '@prisma/client'
import type { Except } from 'type-fest'

import { prisma } from '~/server/db'
import { generateRandomBase32 } from '~/server/secure'
import { COOKIE_OPTIONS_BASE } from '~/server/utils'

const COOKIE_NAME = 'session'
const TOKEN_LENGTH = 32
const EXPIRES_AFTER_DAYS = 30

const MS_PER_DAY = 1000 * 60 * 60 * 24

export type Auth =
  | { isAuthenticated: true; session: Session; user: Except<User, 'hashedPassword'> }
  | { isAuthenticated: false; session: null; user: null }

export function generateSessionToken(): string {
  return generateRandomBase32(TOKEN_LENGTH)
}

export function generateSessionId(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}

export async function createSession(token: string, userId: string, userAgent?: string, ipAddress?: string): Promise<Session> {
  const sessionId = generateSessionId(token)

  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + MS_PER_DAY * EXPIRES_AFTER_DAYS),
    },
  })

  return session
}

export async function validateSessionToken(token: string | null): Promise<Auth> {
  if (token === null || token === '') {
    return { isAuthenticated: false, session: null, user: null }
  }

  const sessionId = generateSessionId(token)

  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  })

  if (result === null) {
    return { isAuthenticated: false, session: null, user: null }
  }

  const { user, ...session } = result

  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    })

    return { isAuthenticated: false, session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - MS_PER_DAY * (EXPIRES_AFTER_DAYS / 2)) {
    session.expiresAt = new Date(Date.now() + MS_PER_DAY * EXPIRES_AFTER_DAYS)

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    })
  }

  const userWithoutPassword = omit(user, ['hashedPassword'])

  return { isAuthenticated: true, session, user: userWithoutPassword }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  })
}

export async function invalidateUserSessions(userId: User['id']): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  })
}

export function getSessionTokenCookie(): string | null {
  return getCookie(COOKIE_NAME) ?? null
}

export function setSessionTokenCookie(token: string, expiresAt: Date): void {
  setCookie(COOKIE_NAME, token, {
    ...COOKIE_OPTIONS_BASE,
    expires: expiresAt,
  })
}

export function deleteSessionTokenCookie(): void {
  deleteCookie(COOKIE_NAME, COOKIE_OPTIONS_BASE)
}
