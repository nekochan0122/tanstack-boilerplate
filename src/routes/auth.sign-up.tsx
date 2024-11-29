import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useForm } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { InputPassword } from '~/components/ui/input-password'
import { Link } from '~/components/ui/link'
import { authClient } from '~/libs/auth-client'
import { signUpSchema } from '~/services/auth.schema'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpRoute,
})

function SignUpRoute() {
  const t = useTranslations()

  const form = useForm(signUpSchema(t), {
    defaultValues: {
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      ...(import.meta.env.DEV && {
        name: 'User',
        username: 'user',
        password: '!Ab12345',
        passwordConfirm: '!Ab12345',
        email: import.meta.env.VITE_APP_EMAIL,
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(value, {
        onRequest: () => {
          toast.loading(t('auth.sign-up-loading'))
        },
        onSuccess: () => {
          toast.dismiss()
          toast.success(t('auth.sign-up-success'))
        },
        onError: ({ error }) => {
          toast.dismiss()
          toast.error(t('auth.sign-up-error'), {
            description: error.message, // TODO: i18n
          })
        },
      })
    },
  })

  return (
    <Card className='w-full lg:max-w-md'>
      <CardHeader>
        <CardTitle>{t('auth.sign-up')}</CardTitle>
        <CardDescription>{t('auth.sign-up-description')}</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <form.Root>
          <form.Field
            name='name'
            render={(field) => (
              <field.Container label={t('auth.name')}>
                <Input />
              </field.Container>
            )}
          />
          <form.Field
            name='email'
            render={(field) => (
              <field.Container label={t('auth.email')}>
                <Input />
              </field.Container>
            )}
          />
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
          <form.Field
            name='passwordConfirm'
            render={(field) => (
              <field.Container label={t('auth.password-confirm')}>
                <InputPassword />
              </field.Container>
            )}
          />
          <form.Submit>
            {t('auth.sign-up')}
          </form.Submit>
        </form.Root>

        <div className='flex items-center justify-center gap-2'>
          <p>{t('auth.already-have-an-account')}</p>
          <Button asChild variant='link' className='h-auto p-0 text-base'>
            <Link to='/auth/sign-in'>{t('auth.sign-in')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
