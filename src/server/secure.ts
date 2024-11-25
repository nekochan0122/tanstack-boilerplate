import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding'

export function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}

export function generateRandomBase32(desiredLength: number): string {
  const bytes = generateRandomBytes(Math.ceil(desiredLength * 5 / 8))
  const value = encodeBase32UpperCaseNoPadding(bytes).slice(0, desiredLength)
  return value
}
