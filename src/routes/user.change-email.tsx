import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { useForm } from '~/components/ui/form'
import { authClient } from '~/libs/auth-client'
import { useAuthedQuery } from '~/services/auth.query'
import { changeEmailSchema } from '~/services/user.schema'

export const Route = createFileRoute('/user/change-email')({
  component: ChangeEmailRoute,
})

function ChangeEmailRoute() {
  const t = useTranslations()

  const authedQuery = useAuthedQuery()

  const changeEmailForm = useForm(
    changeEmailSchema(t).refine(
      (values) => values.newEmail !== authedQuery.data.user.email,
      { path: ['newEmail'], message: t('auth.email-must-different') },
    ), {
      defaultValues: {
        newEmail: '',
      },
      onSubmit: async ({ value, formApi }) => {
        await authClient.changeEmail(value, {
          onRequest: () => {
            toast.loading(t('common.submit-loading'))
          },
          onSuccess: () => {
            toast.dismiss()
            toast.success(t('common.submit-success'))
            formApi.reset()
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

  const ChangeEmailFormBuilder = createBasicFormBuilder(changeEmailForm)({
    base: {
      submit: t('common.submit'),
    },
    fields: [
      {
        type: 'email',
        name: 'newEmail',
        label: t('auth.new-email'),
        inputProps: {
          placeholder: authedQuery.data.user.email,
        },
      },
    ],
  })

  return <ChangeEmailFormBuilder />
}
