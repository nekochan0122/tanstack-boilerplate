/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-object-type */

import { z } from 'zod'

import { logger } from '~/libs/logger'
import { handleZodErrors } from '~/libs/zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string(),
  APP_SECRET: z.string(),
  AUTH_SECRET: z.string(),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
}) satisfies z.ZodObject<Record<string, z.ZodString>>

const result = await envSchema.safeParseAsync({
  ...import.meta.env,
  ...process.env,
})

if (result.error) {
  handleZodErrors(result.error)

  throw new Error('Invalid environment variables')
}

const total = Object.keys(result.data).length

logger.info(`Environment variables parsed successfully (${total} variables)`)

// Infer types

type Env = z.infer<typeof envSchema>
type PublicPrefix = 'VITE_'
type PublicKey = keyof Env & `${PublicPrefix}${string}`
type PublicEnv = Pick<Env, PublicKey>
type PrivateEnv = Omit<Env, PublicKey>

type ViteBuiltInEnv = {
  MODE: 'development' | 'production' | 'test'
  DEV: boolean
  SSR: boolean
  PROD: boolean
  BASE_URL: string
}

declare global {
  interface ImportMetaEnv extends PublicEnv, ViteBuiltInEnv {}

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  namespace NodeJS {
    interface ProcessEnv extends PrivateEnv {}
  }
}
