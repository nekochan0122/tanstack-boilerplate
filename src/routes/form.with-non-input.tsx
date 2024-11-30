import { createFileRoute } from '@tanstack/react-router'
import { faker } from 'faker'
import { toast } from 'sonner'
import { z } from 'zod'

import { useForm } from '~/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export const Route = createFileRoute('/form/with-non-input')({
  loader: async () => {
    const foods = faker.helpers.uniqueArray(faker.food.dish, 10)

    return {
      foods,
    }
  },
  component: FormWithNonInputRoute,
})

const exampleSchema = z.object({
  favoriteFood: z.string().optional(),
})

function FormWithNonInputRoute() {
  const { foods } = Route.useLoaderData()

  const form = useForm(exampleSchema, {
    defaultValues: {
      favoriteFood: '',
    },
    onSubmit: ({ value, formApi }) => {
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
        name='favoriteFood'
        render={(field) => (
          <field.Container
            label='With Select'
            detail='Select your favorite food'
            /**
             * @Note
             * By default, FieldContainer's child component is managed by FieldController,
             * which handles `id`, `name`, `value`, `onChange`, and `onBlur` for you.
             * To manage these props yourself, set `disableController`.
             *
             * @Important
             * FieldController works with components beyond Input, as long as they use similar props.
             * - If `onChange` receives a `ChangeEvent`, it extracts the value from `event.target.X` (X depends on the input type).
             * - Otherwise, it uses the provided parameter directly.
             *
             * This example disables FieldController for manual handling.
             */
            disableController
          >
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
              >
                <SelectValue placeholder='What is your favorite food?' />
              </SelectTrigger>
              <SelectContent>
                {foods.map((food) => (
                  <SelectItem key={food} value={food}>
                    {food}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </field.Container>
        )}
      />
      <form.Submit>Submit</form.Submit>
    </form.Root>
  )
}
