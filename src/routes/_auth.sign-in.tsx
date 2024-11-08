import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useForm } from '~/components/ui/form'
import { Separator } from '~/components/ui/separator'
import { socialProviders } from '~/config/social-provider'
import { cx } from '~/libs/utils'
import { useSignInMutation, useSignInSocialMutation } from '~/services/auth.query'
import { signInSchema } from '~/services/auth.schema'
import type { SupportedSocialProviderId } from '~/config/social-provider'

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInRoute,
})

function SignInRoute() {
  const t = useTranslations()

  const search = useSearch({ from: '/_auth' })

  const signInMutation = useSignInMutation()
  const signInSocialMutation = useSignInSocialMutation()

  const signInForm = useForm(signInSchema(t), {
    defaultValues: {
      username: 'nekochan',
      password: '12345678Ab!',
      dontRememberMe: false,
    },
    onSubmit: async ({ value }) => {
      // TODO: error handling

      const signInPromise = signInMutation.mutateAsync(value)

      toast.promise(signInPromise, {
        loading: t('auth.sign-in-loading'),
        success: t('auth.sign-in-success'),
        error: t('auth.sign-in-error'),
      })

      await signInPromise
    },
  })

  const SignInFormBuilder = createBasicFormBuilder(signInForm)({
    base: {
      submit: t('auth.sign-in'),
    },
    fields: [
      {
        type: 'text',
        name: 'username',
        label: t('auth.username'),
      },
      {
        type: 'password',
        name: 'password',
        label: t('auth.password'),
      },
    ],
  })

  function handleSignInSocial({
    provider,
  }: {
    provider: SupportedSocialProviderId
  }) {
    return () =>
      signInSocialMutation.mutate({
        provider,
        callbackURL: search.callbackURL,
      })
  }

  return (
    <Card className='w-full lg:max-w-md'>
      <CardHeader>
        <CardTitle>{t('auth.sign-in')}</CardTitle>
        <CardDescription>{t('auth.sign-in-description')}</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <SignInFormBuilder />

        <div className='flex items-center justify-between'>
          <Separator className='flex-1' />
          <span className='px-4 text-muted-foreground'>{t('auth.or')}</span>
          <Separator className='flex-1' />
        </div>

        <div className='w-full space-y-4'>
          {socialProviders.map((socialProvider) => (
            <Button
              key={socialProvider.id}
              onClick={handleSignInSocial({ provider: socialProvider.id })}
              style={{ '--social-bg': socialProvider.backgroundColor }}
              className={cx(
                'w-full items-center justify-center gap-2 border',
                'bg-[var(--social-bg)] hover:bg-[var(--social-bg)] focus-visible:ring-[var(--social-bg)]',
                'brightness-100 hover:brightness-90',
                socialProvider.id === 'google' && 'focus-visible:ring-ring',
              )}
            >
              <socialProvider.icon size={socialProvider.size} color={socialProvider.logoColor} />
              <span style={{ color: socialProvider.textColor }}>
                {t('auth.sign-in-social', { name: socialProvider.name })}
              </span>
            </Button>
          ))}
        </div>

        <div className='flex items-center justify-center gap-2'>
          <p>{t('auth.dont-have-an-account')}</p>
          <Button asChild variant='link' className='h-auto p-0 text-base'>
            <Link to='/sign-up'>{t('auth.sign-up')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
