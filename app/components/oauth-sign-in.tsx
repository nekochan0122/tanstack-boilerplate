import { useSearch } from '@tanstack/react-router'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/ui/button'
import { oauthConfigs } from '~/config/oauth'
import { cx } from '~/libs/utils'
import { useSignInOAuthMutation } from '~/services/auth.query'
import type { SupportedOAuthProviderId } from '~/config/oauth'

export function OAuthSignIn() {
  const t = useTranslations()

  const search = useSearch({ from: '/(authentication)/_auth' })

  const signInOAuthMutation = useSignInOAuthMutation()

  function handleSignInOAuth({ provider }: { provider: SupportedOAuthProviderId }) {
    return () => signInOAuthMutation.mutate({
      provider,
      callbackURL: search.callbackURL,
    })
  }

  return (
    <div className='w-full space-y-4'>
      {oauthConfigs.map((oauth) => (
        <Button
          key={oauth.id}
          onClick={handleSignInOAuth({ provider: oauth.id })}
          style={{ '--oauth-bg': oauth.backgroundColor }}
          className={cx(
            'w-full items-center justify-center gap-2 border',
            'bg-[var(--oauth-bg)] hover:bg-[var(--oauth-bg)] focus-visible:ring-[var(--oauth-bg)]',
            'brightness-100 hover:brightness-90',
            oauth.id === 'google' && 'focus-visible:ring-ring',
          )}
        >
          <oauth.icon size={oauth.size} color={oauth.logoColor} />
          <span style={{ color: oauth.textColor }}>
            {t('auth.oauth-sign-in', { name: oauth.name })}
          </span>
        </Button>
      ))}
    </div>
  )
}
