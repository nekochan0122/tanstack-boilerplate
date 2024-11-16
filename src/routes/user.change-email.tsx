import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslations } from 'use-intl'

import { createBasicFormBuilder } from '~/components/form/basic'
import { useForm } from '~/components/ui/form'
import { useAuthedQuery } from '~/services/auth.query'
import { useChangeEmailMutation } from '~/services/user.query'
import { changeEmailSchema } from '~/services/user.schema'

export const Route = createFileRoute('/user/change-email')({
  component: ChangeEmailRoute,
})

function ChangeEmailRoute() {
  const t = useTranslations()

  const authedQuery = useAuthedQuery()

  const changeEmailMutation = useChangeEmailMutation()

  const changeEmailForm = useForm(
    changeEmailSchema(t).refine(
      (values) => values.newEmail !== authedQuery.data.user.email,
      { path: ['newEmail'], message: t('auth.email-must-different') },
    ), {
      defaultValues: {
        newEmail: '',
      },
      onSubmit: async ({ value }) => {
        const changeEmailPromise = changeEmailMutation.mutateAsync({ data: value })

        toast.promise(changeEmailPromise, {
          loading: t('common.submit-loading'),
          success: t('common.submit-success'),
          error: t('common.submit-error'),
        })

        await changeEmailPromise
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
