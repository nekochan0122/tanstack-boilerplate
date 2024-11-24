import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding'
import { getCookie, setCookie } from 'vinxi/http'
import type { CookieSerializeOptions } from 'vinxi/http'

import { tryCatchSync } from '~/libs/utils'

export const COOKIE_OPTIONS_BASE = {
  path: '/',
  secure: import.meta.env.PROD,
  httpOnly: true,
  sameSite: 'lax',
} as const satisfies CookieSerializeOptions

export function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

export function generateRandomOTP(): string {
  const bytes = generateRandomBytes(5)
  const otp = encodeBase32UpperCaseNoPadding(bytes)
  return otp
}

export function generateRandomRecoveryCode(): string {
  const bytes = generateRandomBytes(10)
  const recoveryCode = encodeBase32UpperCaseNoPadding(bytes)
  return recoveryCode
}

export function setCookieJSON(name: string, value: unknown, serializeOptions?: CookieSerializeOptions): void {
  const [stringifiedError, stringifiedValue] = tryCatchSync(() => JSON.stringify(value))
  if (stringifiedError) return

  const [encodedError, encodedValue] = tryCatchSync(() => encodeURIComponent(stringifiedValue))
  if (encodedError) return

  setCookie(name, encodedValue, serializeOptions)
}

export function getCookieJSON(name: string): unknown | undefined {
  const cookie = getCookie(name)
  if (!cookie) return undefined

  const [decodedError, decodedValue] = tryCatchSync(() => decodeURIComponent(cookie))
  if (decodedError) return undefined

  const [parsedError, parsedValue] = tryCatchSync(() => JSON.parse(decodedValue))
  if (parsedError) return undefined

  return parsedValue
}
