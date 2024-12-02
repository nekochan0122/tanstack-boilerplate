import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { useForm } from '~/components/ui/form'
import { InputPassword } from '~/components/ui/input-password'
import { authClient } from '~/libs/auth-client'
import { tKey } from '~/libs/i18n'
import { passwordSchema } from '~/services/auth.schema'

export const Route = createFileRoute('/user/change-password')({
  component: ChangePasswordRoute,
})

const changePasswordSchema = (t = tKey) => z
  .object({
    revokeOtherSessions: z.boolean().optional(),
    currentPassword: passwordSchema(t),
    newPassword: passwordSchema(t),
    newPasswordConfirm: passwordSchema(t),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: t('auth.password-must-different'),
  })
  .refine((values) => values.newPassword === values.newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: t('auth.password-must-match'),
  })

function ChangePasswordRoute() {
  const t = useTranslations()

  const form = useForm(changePasswordSchema(t), {
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      revokeOtherSessions: true,
    },
    onSubmit: async ({ value }) => {
      await authClient.changePassword(value, {
        onRequest: () => {
          toast.loading(t('common.submit-loading'))
        },
        onSuccess: () => {
          toast.dismiss()
          toast.success(t('common.submit-success'))
        },
        onError: ({ error }) => {
          toast.dismiss()
          toast.error(t('common.submit-error'), {
            description: error.message, // TODO: i18n
          })
        },
      })
    },
  })

  return (
    <form.Root>
      {/*
        [DOM] Password forms should have (optionally hidden) username fields for accessibility
          - https://goo.gl/9p2vKq
          - https://stackoverflow.com/a/77160563
      */}
      <input hidden type='text' autoComplete='username' />
      <form.Field
        name='currentPassword'
        render={(field) => (
          <field.Container label={t('auth.current-password')}>
            <InputPassword />
          </field.Container>
        )}
      />
      <form.Field
        name='newPassword'
        render={(field) => (
          <field.Container label={t('auth.new-password')}>
            <InputPassword />
          </field.Container>
        )}
      />
      <form.Field
        name='newPasswordConfirm'
        render={(field) => (
          <field.Container label={t('auth.new-password-confirm')}>
            <InputPassword />
          </field.Container>
        )}
      />
      <form.Submit>
        {t('common.submit')}
      </form.Submit>
    </form.Root>
  )
}
