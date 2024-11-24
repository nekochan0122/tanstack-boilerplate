import { createAPIFileRoute } from '@tanstack/start/api'
import { generateCodeVerifier, generateState } from 'arctic'
import { status } from 'http-status'
import { setCookie } from 'vinxi/http'

import { socialCookieOptions, socialProviderSchema, socialProvidersConfig } from '~/server/social'

export const Route = createAPIFileRoute('/api/auth/connect/$provider-id')({
  GET: async ({ params }) => {
    const providerId = socialProviderSchema.safeParse(params['provider-id'])
    if (providerId.error) {
      return new Response('Unknown Provider', {
        status: status.BAD_REQUEST,
      })
    }

    const provider = socialProvidersConfig[providerId.data]

    const state = generateState()
    setCookie(`${providerId.data}_state`, state, socialCookieOptions)

    let url: URL
    if (provider.requiresPKCE) {
      const codeVerifier = generateCodeVerifier()
      setCookie(`${providerId.data}_code_verifier`, codeVerifier, socialCookieOptions)

      url = provider.arcticInstance.createAuthorizationURL(
        state,
        codeVerifier,
        provider.scopes,
      )
    }
    else {
      url = provider.arcticInstance.createAuthorizationURL(state, provider.scopes)
    }

    return new Response(null, {
      status: status.FOUND,
      headers: {
        Location: url.toString(),
      },
    })
  },
})
