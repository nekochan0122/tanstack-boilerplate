import type { OAuth2Tokens } from 'arctic'
import type { CookieSerializeOptions } from 'vinxi/http'

import { objectKeysTyped } from '~/libs/utils'
import { constructZodLiteralUnionType } from '~/libs/zod'
import { discordConfig } from '~/server/socials/discord'
import { githubConfig } from '~/server/socials/github'
import { googleConfig } from '~/server/socials/google'
import { COOKIE_OPTIONS_BASE } from '~/server/utils'

const socialCookieOptions: CookieSerializeOptions = {
  ...COOKIE_OPTIONS_BASE,
  maxAge: 60 * 10, // 10 min
}

type SocialProviderConfig = {
  arcticInstance: object
  requiresPKCE: boolean
  scopes: string[]
  getProfile: (tokens: OAuth2Tokens) => Promise<{
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string
  }>
}

const socialProvidersConfig = {
  discord: discordConfig,
  google: googleConfig,
  github: githubConfig,
} as const satisfies Record<string, SocialProviderConfig>

const socialProviders = objectKeysTyped(socialProvidersConfig)
const socialProviderSchema = constructZodLiteralUnionType(socialProviders)

type SocialProvider = typeof socialProviders[number]
type SocialProviderLink = `/api/auth/${'connect' | 'callback'}/${SocialProvider}`

type SocialProvidersConfig = typeof socialProvidersConfig
type SocialProviderWithPKCE = {
  [Id in SocialProvider]: SocialProvidersConfig[Id]['requiresPKCE'] extends true ? Id : never;
}[keyof SocialProvidersConfig]
type SocialProviderWithoutPKCE = Exclude<SocialProvider, SocialProviderWithPKCE>

export { socialCookieOptions }
export { socialProviders, socialProviderSchema, socialProvidersConfig }
export type { SocialProviderConfig }
export type { SocialProvider, SocialProviderLink }
export type { SocialProviderWithoutPKCE, SocialProviderWithPKCE }
