import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createFancyFormBuilder } from '~/components/form/fancy'
import { useForm } from '~/components/ui/form'
import { useAuthedQuery } from '~/services/auth.query'
import { NAME_MAX, USERNAME_MAX } from '~/services/auth.schema'
import { useUpdateUserMutation } from '~/services/user.query'
import { updateUserSchema } from '~/services/user.schema'

export const Route = createFileRoute('/user/account-settings')({
  component: AccountSettingsRoute,
})

function AccountSettingsRoute() {
  const t = useTranslations()

  const authedQuery = useAuthedQuery()
  const updateUserMutation = useUpdateUserMutation()

  const accountSettingsForm = useForm(updateUserSchema(t), {
    defaultValues: {
      username: authedQuery.data.user.username || undefined,
      name: authedQuery.data.user.name,
    },
    onSubmit: async ({ value }) => {
      const updateUserPromise = updateUserMutation.mutateAsync({ data: value })

      toast.promise(updateUserPromise, {
        loading: t('common.save-loading'),
        success: t('common.save-success'),
        error: t('common.save-error'),
      })

      await updateUserPromise
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
