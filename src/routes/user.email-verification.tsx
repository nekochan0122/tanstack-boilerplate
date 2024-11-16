import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { createBasicFormBuilder } from '~/components/form/basic'
import { useForm } from '~/components/ui/form'
import { useAuthedQuery } from '~/services/auth.query'
import { useSendVerifyEmailMutation } from '~/services/user.query'

export const Route = createFileRoute('/user/email-verification')({
  component: EmailVerificationRoute,
})

function EmailVerificationRoute() {
  const t = useTranslations()

  const authedQuery = useAuthedQuery()

  const sendVerifyEmailMutation = useSendVerifyEmailMutation()

  const sendVerifyEmailForm = useForm(z.any(), {
    defaultValues: {
      email: authedQuery.data.user.email,
    },
    async onSubmit() {
      const sendVerifyEmailPromise = sendVerifyEmailMutation.mutateAsync(undefined)

      toast.promise(sendVerifyEmailPromise, {
        loading: t('common.submit-loading'),
        success: t('common.submit-success'),
        error: t('common.submit-error'),
      })

      await sendVerifyEmailPromise
    },
  })

  const SendVerifyEmailFormBuilder = createBasicFormBuilder(sendVerifyEmailForm)({
    base: {
      submit: {
        children: t('common.submit'),
        disabled: authedQuery.data.user.emailVerified,
      },
    },
    fields: [
      {
        type: 'text',
        name: 'email',
        label: t('auth.email'),
        inputProps: {
          disabled: true,
        },
      },
    ],
  })

  return <SendVerifyEmailFormBuilder />
}
