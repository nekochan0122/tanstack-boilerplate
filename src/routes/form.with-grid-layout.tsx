import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import { useForm } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { InputPassword } from '~/components/ui/input-password'

export const Route = createFileRoute('/form/with-grid-layout')({
  component: FormGridLayoutRoute,
})

const exampleSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8),
})

function FormGridLayoutRoute() {
  const form = useForm(exampleSchema, {
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
    },
    onSubmit: ({ value, formApi }) => {
      toast.success('Submitted!', {
        description: () => <pre>{JSON.stringify(value, null, 2)}</pre>,
      })

      formApi.reset()
    },
  })

  return (
    <form.Root>
      <div className='grid grid-cols-2 gap-4'>
        <form.Field
          name='firstName'
          render={(field) => (
            <field.Container label='First Name'>
              <Input />
            </field.Container>
          )}
        />
        <form.Field
          name='lastName'
          render={(field) => (
            <field.Container label='Last Name'>
              <Input />
            </field.Container>
          )}
        />
      </div>
      <form.Field
        name='password'
        render={(field) => (
          <field.Container label='Password'>
            <InputPassword />
          </field.Container>
        )}
      />
      <form.Submit>Submit</form.Submit>
    </form.Root>
  )
}
