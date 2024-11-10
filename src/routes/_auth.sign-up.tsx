import { createFileRoute, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useForm } from '~/components/ui/form'
import { Link } from '~/components/ui/link'
import { useSignUpMutation } from '~/services/auth.query'
import { signUpSchema } from '~/services/auth.schema'

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpRoute,
})

function SignUpRoute() {
  const t = useTranslations()

  const search = useSearch({ from: '/_auth' })

  const signUpMutation = useSignUpMutation(search)

  const signUpForm = useForm(signUpSchema(t), {
    defaultValues: {
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      ...(import.meta.env.DEV && {
        name: 'NekoChan',
        username: 'nekochan',
        password: '12345678Ab!',
        passwordConfirm: '12345678Ab!',
        email: 'example@example.com',
      }),
    },
    onSubmit: async ({ value }) => {
      // TODO: error handling

      const signUpPromise = signUpMutation.mutateAsync(value)

      toast.promise(signUpPromise, {
        loading: t('auth.sign-up-loading'),
        success: t('auth.sign-up-success'),
        error: t('auth.sign-up-error'),
      })

      await signUpPromise
    },
  })

  const SignUpFormBuilder = createBasicFormBuilder(signUpForm)({
    base: {
      submit: t('auth.sign-up'),
    },
    fields: [
      {
        type: 'text',
        name: 'name',
        label: t('auth.name'),
      },
      {
        type: 'text',
        name: 'email',
        label: t('auth.email'),
      },
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
      {
        type: 'password',
        name: 'passwordConfirm',
        label: t('auth.password-confirm'),
      },
    ],
  })

  return (
    <Card className='w-full lg:max-w-md'>
      <CardHeader>
        <CardTitle>{t('auth.sign-up')}</CardTitle>
        <CardDescription>{t('auth.sign-up-description')}</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <SignUpFormBuilder />

        <div className='flex items-center justify-center gap-2'>
          <p>{t('auth.already-have-an-account')}</p>
          <Button asChild variant='link' className='h-auto p-0 text-base'>
            <Link to='/sign-in'>{t('auth.sign-in')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
