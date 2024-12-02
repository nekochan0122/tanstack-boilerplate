import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { useForm } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { authClient } from '~/libs/auth-client'
import { useAuthedQuery } from '~/services/auth.query'

export const Route = createFileRoute('/user/email-verification')({
  component: EmailVerificationRoute,
})

function EmailVerificationRoute() {
  const t = useTranslations()

  const authedQuery = useAuthedQuery()

  const form = useForm(z.any(), {
    defaultValues: {
      email: authedQuery.data.user.email,
    },
    async onSubmit() {
      await authClient.sendVerificationEmail({
        email: authedQuery.data.user.email,
        callbackURL: window.location.href,
      }, {
        onSuccess: () => {
          toast.success(t('common.submit-success'))
        },
        onError: ({ error }) => {
          toast.error(t('common.submit-error'), {
            description: error.message, // TODO: i18n
          })
        },
      })
    },
  })

  return (
    <form.Root>
      <form.Field
        name='email'
        render={(field) => (
          <field.Container label={t('auth.email')}>
            <Input disabled />
          </field.Container>
        )}
      />
      <form.Submit disabled={authedQuery.data.user.emailVerified}>
        {t('common.submit')}
      </form.Submit>
    </form.Root>
  )
}
