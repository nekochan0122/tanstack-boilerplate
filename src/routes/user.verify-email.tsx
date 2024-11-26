import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { useForm } from '~/components/ui/form'
import { useVerifyEmailMutation } from '~/services/user.query'
import { verifyEmailSchema } from '~/services/user.schema'

export const Route = createFileRoute('/user/verify-email')({
  component: EmailVerificationRoute,
})

function EmailVerificationRoute() {
  const t = useTranslations()

  const verifyEmailMutation = useVerifyEmailMutation()

  const verifyEmailForm = useForm(verifyEmailSchema(t), {
    defaultValues: {
      code: '',
    },
    async onSubmit({ value, formApi }) {
      const verifyEmailPromise = verifyEmailMutation.mutateAsync({ data: value }, {
        onSuccess: () => formApi.reset(),
      })

      toast.promise(verifyEmailPromise, {
        loading: t('auth.email-verification-loading'),
        success: t('auth.email-verification-success'),
        error: t('auth.email-verification-error'),
      })

      await verifyEmailPromise
    },
  })

  const VerifyEmailFormBuilder = createBasicFormBuilder(verifyEmailForm)({
    base: {
      submit: t('common.submit'),
    },
    fields: [
      {
        type: 'text',
        name: 'code',
        label: t('auth.email-verification-code'),
      },
    ],
  })

  return <VerifyEmailFormBuilder />
}
