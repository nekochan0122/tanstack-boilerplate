import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { status } from 'http-status'
import { deleteCookie, getCookie } from 'vinxi/http'
import type { OAuth2Tokens } from 'arctic'

import { socialProviderSchema, socialProvidersConfig } from '~/server/social'

export const Route = createAPIFileRoute('/api/auth/callback/$provider-id')({
  GET: async ({ request, params }) => {
    const providerId = socialProviderSchema.safeParse(params['provider-id'])
    if (providerId.error) {
      return new Response('Unknown Provider', {
        status: status.BAD_REQUEST,
      })
    }

    const provider = socialProvidersConfig[providerId.data]

    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    const cookieState = getCookie(`${providerId.data}_state`) ?? null
    const cookieCodeVerifier = getCookie(`${providerId.data}_code_verifier`) ?? null

    if (code === null || state === null || cookieState !== state) {
      return new Response(null, {
        status: status.BAD_REQUEST,
      })
    }

    let tokens: OAuth2Tokens
    if (provider.requiresPKCE) {
      if (cookieCodeVerifier === null) {
        return new Response(null, {
          status: status.BAD_REQUEST,
        })
      }

      tokens = await provider.arcticInstance.validateAuthorizationCode(code, cookieCodeVerifier)
    }
    else {
      tokens = await provider.arcticInstance.validateAuthorizationCode(code)
    }

    deleteCookie(`${providerId.data}_state`)
    deleteCookie(`${providerId.data}_code_verifier`)

    const profile = await provider.getProfile(tokens)

    // 1.  if user not signed in, check if the social account exists
    // 1.A if not, redirect to sign-in page and show an error message
    // 1.B if yes, redirect to callback URL
    // 2.  if user signed in, check if the social account exists
    // 2.A if not, create a new social account to the user (connect)
    // 2.B if yes, remove the social account from the user (disconnect)

    return json(profile)
  },
})
