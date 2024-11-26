import type { User, Verification } from '@prisma/client'

import { prisma } from '~/server/db'
import { generateRandomBase32 } from '~/server/secure'

const CODE_LENGTH = 6
const EXPIRES_AFTER_MS = 1000 * 60 * 5

type VerificationType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'

export async function createVerification(
  type: VerificationType,
  email: string,
  userId: User['id'],
): Promise<Verification> {
  await deleteVerification(type, userId)

  const code = generateRandomBase32(CODE_LENGTH)
  const expiresAt = new Date(Date.now() + EXPIRES_AFTER_MS)

  const verification = await prisma.verification.create({
    data: {
      type,
      email,
      code,
      userId: userId,
      expiresAt,
    },
  })

  return verification
}

export async function getVerification(
  type: VerificationType,
  userId: User['id'],
) {
  const verification = await prisma.verification.findFirst({
    where: {
      type,
      userId: userId,
    },
  })

  return verification
}

export async function deleteVerification(
  type: VerificationType,
  id: User['id'],
): Promise<void> {
  await prisma.verification.deleteMany({
    where: {
      userId: id,
      type,
    },
  })
}
