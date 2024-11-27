import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createFancyFormBuilder } from '~/components/form/fancy'
import { useForm } from '~/components/ui/form'
import { authClient } from '~/libs/auth-client'
import { useAuthedQuery } from '~/services/auth.query'
import { NAME_MAX, USERNAME_MAX } from '~/services/auth.schema'
import { updateUserSchema } from '~/services/user.schema'

export const Route = createFileRoute('/user/account-settings')({
  component: AccountSettingsRoute,
})

function AccountSettingsRoute() {
  const t = useTranslations()

  const authedQuery = useAuthedQuery()

  const accountSettingsForm = useForm(updateUserSchema(t), {
    defaultValues: {
      username: authedQuery.data.user.username,
      name: authedQuery.data.user.name,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.updateUser(value, {
        onRequest: () => {
          toast.loading(t('common.save-loading'))
        },
        onSuccess: () => {
          toast.dismiss()
          toast.success(t('common.save-success'))
          formApi.reset()
        },
        onError: ({ error }) => {
          toast.dismiss()
          toast.error(t('common.save-error'), {
            description: error.message, // TODO: i18n
          })
        },
      })
    },
  })

  const AccountSettingsFormBuilder = createFancyFormBuilder(accountSettingsForm)({
    base: {
      submit: t('common.save'),
    },
    fields: [
      {
        type: 'text',
        name: 'username',
        label: t('auth.username'),
        description: t('auth.username-description'),
        info: t('auth.username-max', { max: USERNAME_MAX }),
      },
      {
        type: 'text',
        name: 'name',
        label: t('auth.name'),
        description: t('auth.name-description'),
        info: t('auth.name-max', { max: NAME_MAX }),
      },
    ],
  })

  return <AccountSettingsFormBuilder />
}
