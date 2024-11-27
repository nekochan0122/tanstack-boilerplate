import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { useForm } from '~/components/ui/form'
import { authClient } from '~/libs/auth-client'
import { changePasswordSchema } from '~/services/user.schema'

export const Route = createFileRoute('/user/change-password')({
  component: ChangePasswordRoute,
})

function ChangePasswordRoute() {
  const t = useTranslations()

  const changePasswordForm = useForm(changePasswordSchema(t), {
    defaultValues: {
      username: undefined,
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

  const ChangePasswordFormBuilder = createBasicFormBuilder(changePasswordForm)({
    base: {
      submit: t('common.submit'),
    },
    fields: [
      // https://www.chromium.org/developers/design-documents/create-amazing-password-forms/#use-hidden-fields-for-implicit-information
      // https://stackoverflow.com/questions/48525114/chrome-warning-dom-password-forms-should-have-optionally-hidden-username-field
      {
        type: 'text',
        name: 'username',
        label: 'ForAccessibility',
        inputProps: {
          autoComplete: 'username',
          className: 'hidden',
        },
      },
      {
        type: 'password',
        name: 'currentPassword',
        label: t('auth.current-password'),
      },
      {
        type: 'password',
        name: 'newPassword',
        label: t('auth.new-password'),
      },
      {
        type: 'password',
        name: 'newPasswordConfirm',
        label: t('auth.new-password-confirm'),
      },
    ],
  })

  return <ChangePasswordFormBuilder />
}
