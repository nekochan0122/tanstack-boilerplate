import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { OAuthSignIn } from '~/components/oauth-sign-in'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useForm } from '~/components/ui/form'
import { Separator } from '~/components/ui/separator'
import { useSignInMutation } from '~/services/auth.query'
import { signInSchema } from '~/services/auth.schema'

export const Route = createFileRoute('/(authentication)/_auth/sign-in')({
  component: SignInRoute,
})

function SignInRoute() {
  const t = useTranslations()

  const signInMutation = useSignInMutation()

  const form = useForm(signInSchema(t), {
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

  const SignInFormBuilder = createBasicFormBuilder(form)({
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

  return (
    <Card className='w-full lg:max-w-md'>
      <CardHeader>
        <CardTitle>
          {t('auth.sign-in')}
        </CardTitle>
        <CardDescription>
          {t('auth.sign-in-description')}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <SignInFormBuilder />

        <div className='flex items-center justify-between'>
          <Separator className='flex-1' />
          <span className='px-4 text-muted-foreground'>
            {t('auth.or')}
          </span>
          <Separator className='flex-1' />
        </div>

        <OAuthSignIn />

        <div className='flex items-center justify-center gap-2'>
          <p>
            {t('auth.dont-have-an-account')}
          </p>
          <Button asChild variant='link' className='h-auto p-0 text-base'>
            <Link to='/sign-up'>
              {t('auth.sign-up')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
