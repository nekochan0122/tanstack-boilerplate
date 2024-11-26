import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { Button } from '~/components/ui/button'
import { useForm } from '~/components/ui/form'
import { Separator } from '~/components/ui/separator'
import { useResendEmailVerifMutation, useVerifyEmailMutation } from '~/services/user.query'
import { verifyEmailSchema } from '~/services/user.schema'

export const Route = createFileRoute('/user/verify-email')({
  component: EmailVerificationRoute,
})

function EmailVerificationRoute() {
  const t = useTranslations()

  const verifyEmailMutation = useVerifyEmailMutation()
  const resendEmailVerifMutation = useResendEmailVerifMutation()

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

  async function handleResendEmailVerif() {
    const resendEmailVerifPromise = resendEmailVerifMutation.mutateAsync(undefined)

    toast.promise(resendEmailVerifPromise, {
      loading: t('auth.email-verification-resend-loading'),
      success: t('auth.email-verification-resend-success'),
      error: t('auth.email-verification-resend-error'),
    })
  }

  return (
    <div className='flex w-full max-w-sm flex-col items-center justify-between space-y-4'>
      <VerifyEmailFormBuilder />
      <Separator />
      <Button
        variant='secondary'
        className='w-full'
        onClick={handleResendEmailVerif}
      >
        {t('auth.email-verification-resend')}
      </Button>
    </div>
  )
}
