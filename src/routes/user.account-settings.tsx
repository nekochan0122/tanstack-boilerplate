import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { useForm } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { authClient } from '~/libs/auth-client'
import { tKey } from '~/libs/i18n'
import { useAuthedQuery } from '~/services/auth.query'
import { NAME_MAX, nameSchema, USERNAME_MAX, usernameSchema } from '~/services/auth.schema'

export const Route = createFileRoute('/user/account-settings')({
  component: AccountSettingsRoute,
})

const updateUserSchema = (t = tKey) => z
  .object({
    username: usernameSchema(t).optional(),
    name: nameSchema(t).optional(),
  })

function AccountSettingsRoute() {
  const t = useTranslations()

  const authedQuery = useAuthedQuery()

  const form = useForm(updateUserSchema(t), {
    defaultValues: {
      username: authedQuery.data.user.username,
      name: authedQuery.data.user.name,
    },
    async onSubmit({ value, formApi }) {
      await authClient.updateUser(value, {
        onSuccess: () => {
          toast.success(t('common.save-success'))
          formApi.reset()
        },
        onError: ({ error }) => {
          toast.error(t('common.save-error'), {
            description: error.message, // TODO: i18n
          })
        },
      })
    },
  })

  return (
    <form.Root>
      <form.Field
        name='username'
        render={(field) => (
          <field.Container
            label={t('auth.username')}
            detail={t('auth.username-detail')}
            message={t('auth.username-max', { max: USERNAME_MAX })}
          >
            <Input />
          </field.Container>
        )}
      />
      <form.Field
        name='name'
        render={(field) => (
          <field.Container
            label={t('auth.name')}
            detail={t('auth.name-detail')}
            message={t('auth.name-max', { max: NAME_MAX })}
          >
            <Input />
          </field.Container>
        )}
      />
      <form.Submit>
        {t('common.save')}
      </form.Submit>
    </form.Root>
  )
}
