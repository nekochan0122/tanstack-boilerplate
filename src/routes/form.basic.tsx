import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import { useForm } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

export const Route = createFileRoute('/form/basic')({
  component: BasicFormRoute,
})

const exampleSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

function BasicFormRoute() {
  const form = useForm(exampleSchema, {
    defaultValues: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    onSubmit: async ({ value, formApi }) => {
      toast.success('Submitted!', {
        description: () => (
          <pre>
            {JSON.stringify(value, null, 2)}
          </pre>
        ),
      })

      formApi.reset()
    },
  })

  return (
    <form.Root>
      <form.Field
        name='name'
        render={(field) => (
          <div className='space-y-4'>
            <field.Label>Name</field.Label>
            <field.Controller>
              <Input />
            </field.Controller>
            <field.Message />
          </div>
        )}
      />
      <form.Field
        name='email'
        render={(field) => (
          // Similar to the above, easier to write but less customizable
          <field.Container label='Email'>
            <Input />
          </field.Container>
        )}
      />
      <form.Submit>Submit</form.Submit>
    </form.Root>
  )
}
