import type { User, Verification } from '@prisma/client'

import { prisma } from '~/server/db'
import { generateRandomBase32 } from '~/server/secure'

const CODE_LENGTH = 6
const EXPIRES_AFTER_MS = 1000 * 60 * 10

type VerificationType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'

export async function createVerification(
  type: VerificationType,
  id: User['id'],
  email: string,
): Promise<Verification> {
  await deleteVerification(type, id)

  const code = generateRandomBase32(CODE_LENGTH)
  const expiresAt = new Date(Date.now() + EXPIRES_AFTER_MS)

  const verification = await prisma.verification.create({
    data: {
      userId: id,
      type,
      code,
      email,
      expiresAt,
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
