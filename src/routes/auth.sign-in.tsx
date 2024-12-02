import { createFileRoute, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useForm } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { InputPassword } from '~/components/ui/input-password'
import { Link } from '~/components/ui/link'
import { Separator } from '~/components/ui/separator'
import { socialProviders } from '~/config/social-provider'
import { authClient } from '~/libs/auth-client'
import { tKey } from '~/libs/i18n'
import { cx } from '~/libs/utils'
import { passwordSchema, usernameSchema } from '~/services/auth.schema'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInRoute,
})

const signInSchema = (t = tKey) => z
  .object({
    username: usernameSchema(t),
    password: passwordSchema(t),
    rememberMe: z.boolean().optional(),
  })

function SignInRoute() {
  const t = useTranslations()

  const search = useSearch({ from: '/auth' })

  const form = useForm(signInSchema(t), {
    defaultValues: {
      username: '',
      password: '',
      rememberMe: true,
      ...(import.meta.env.DEV && {
        username: 'user',
        password: '!Ab12345',
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.username(value, {
        onRequest: () => {
          toast.loading(t('auth.sign-in-loading'))
        },
        onSuccess: () => {
          toast.dismiss()
          toast.success(t('auth.sign-in-success'))
        },
        onError: ({ error }) => {
          toast.dismiss()
          toast.error(t('auth.sign-in-error'), {
            description: error.message, // TODO: i18n
          })
        },
      })
    },
  })

  return (
    <Card className='w-full lg:max-w-md'>
      <CardHeader>
        <CardTitle>{t('auth.sign-in')}</CardTitle>
        <CardDescription>{t('auth.sign-in-description')}</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <form.Root>
          <form.Field
            name='username'
            render={(field) => (
              <field.Container label={t('auth.username')}>
                <Input />
              </field.Container>
            )}
          />
          <form.Field
            name='password'
            render={(field) => (
              <field.Container label={t('auth.password')}>
                <InputPassword />
              </field.Container>
            )}
          />
          <form.Submit>
            {t('auth.sign-in')}
          </form.Submit>
        </form.Root>

        <div className='flex items-center justify-between'>
          <Separator className='flex-1' />
          <span className='px-4 text-muted-foreground'>{t('auth.or')}</span>
          <Separator className='flex-1' />
        </div>

        <div className='w-full space-y-4'>
          {socialProviders.map((socialProvider) => (
            <Button
              key={socialProvider.id}
              onClick={() => authClient.signIn.social({ provider: socialProvider.id, callbackURL: search.callbackURL })}
              style={{ '--social-bg': socialProvider.backgroundColor }}
              className={cx(
                'w-full items-center justify-center gap-2 border',
                'bg-[var(--social-bg)] hover:bg-[var(--social-bg)] focus-visible:ring-[var(--social-bg)]',
                'brightness-100 hover:brightness-90',
                socialProvider.id === 'google' && 'focus-visible:ring-ring',
              )}
            >
              <socialProvider.icon
                size={socialProvider.size}
                color={socialProvider.logoColor}
              />
              <span style={{ color: socialProvider.textColor }}>
                {t('auth.sign-in-social', { name: socialProvider.name })}
              </span>
            </Button>
          ))}
        </div>

        <div className='flex items-center justify-center gap-2'>
          <p>{t('auth.dont-have-an-account')}</p>
          <Button asChild variant='link' className='h-auto p-0 text-base'>
            <Link to='/auth/sign-up'>
              {t('auth.sign-up')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
