import type { OAuth2Tokens } from 'arctic'
import type { CookieSerializeOptions } from 'vinxi/http'

import { objectKeysTyped } from '~/libs/utils'
import { constructZodLiteralUnionType } from '~/libs/zod'
import { discordConfig } from '~/server/socials/discord'
import { githubConfig } from '~/server/socials/github'
import { googleConfig } from '~/server/socials/google'
import { COOKIE_OPTIONS_BASE } from '~/server/utils'

export const socialCookieOptions: CookieSerializeOptions = {
  ...COOKIE_OPTIONS_BASE,
  maxAge: 60 * 10, // 10 min
}

export type SocialProviderConfig = {
  arcticInstance: object
  requiresPKCE: boolean
  scopes: string[]
  getProfile: (tokens: OAuth2Tokens) => Promise<{
    id: string
    name: string
  }>
}

export const socialProvidersConfig = {
  discord: discordConfig,
  google: googleConfig,
  github: githubConfig,
} as const satisfies Record<string, SocialProviderConfig>

export const socialProviders = objectKeysTyped(socialProvidersConfig)
export const socialProviderSchema = constructZodLiteralUnionType(socialProviders)

export type SocialProvider = typeof socialProviders[number]
export type SocialProviderLink = `/api/auth/${'connect' | 'callback'}/${SocialProvider}`

export type SocialProvidersConfig = typeof socialProvidersConfig
export type SocialProviderWithPKCE = {
  [Id in SocialProvider]: SocialProvidersConfig[Id]['requiresPKCE'] extends true ? Id : never;
}[keyof SocialProvidersConfig]
export type SocialProviderWithoutPKCE = Exclude<SocialProvider, SocialProviderWithPKCE>
