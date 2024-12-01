import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'

import { Checkbox } from '~/components/ui/checkbox'
import { useForm } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { InputPassword } from '~/components/ui/input-password'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export const Route = createFileRoute('/(examples)/example-form')({
  component: ExampleFormRoute,
})

const exampleSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number().min(0).max(150),
    gender: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    acceptTerms: z.boolean(),
    emailNotifications: z.array(z.string()),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

function ExampleFormRoute() {
  const form = useForm(exampleSchema, {
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      age: 18,
      gender: 'male',
      email: 'john@example.com',
      password: '12345678',
      confirmPassword: '12345678',
      acceptTerms: true,
      emailNotifications: [] as string[],
    },
    onSubmit: ({ value, formApi }) => {
      toast.success('Submitted!')
      console.table(value)
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
              <Input autoComplete='given-name' />
            </field.Container>
          )}
        />
        <form.Field
          name='lastName'
          render={(field) => (
            <field.Container label='Last Name'>
              <Input autoComplete='family-name' />
            </field.Container>
          )}
        />
        <form.Field
          name='age'
          render={(field) => (
            <field.Container label='Age'>
              <Input type='number' />
            </field.Container>
          )}
        />
        <form.Field
          name='gender'
          render={(field) => (
            <field.Container label='Gender' disableController>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                >
                  <SelectValue placeholder='Select a gender' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='male'>Male</SelectItem>
                  <SelectItem value='female'>Female</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </field.Container>
          )}
        />
      </div>
      <form.Field
        name='email'
        render={(field) => (
          <field.Container label='Email'>
            <Input type='email' autoComplete='email' />
          </field.Container>
        )}
      />
      <form.Field
        name='password'
        render={(field) => (
          <field.Container label='Password'>
            <InputPassword autoComplete='new-password' />
          </field.Container>
        )}
      />
      <form.Field
        name='confirmPassword'
        render={(field) => (
          <field.Container label='Confirm Password'>
            <InputPassword autoComplete='new-password' />
          </field.Container>
        )}
      />
      <form.Field
        name='acceptTerms'
        render={(field) => (
          <div className='flex items-start space-x-2'>
            <field.Controller>
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(value) => {
                  if (value === 'indeterminate') return
                  field.handleChange(value)
                }}
              />
            </field.Controller>
            <div className='grid gap-1.5'>
              <field.Label className='leading-none'>
                Accept terms and conditions
              </field.Label>
              <field.Detail>
                You agree to our Terms of Service and Privacy Policy.
              </field.Detail>
            </div>
          </div>
        )}
      />
      <form.Field
        name='emailNotifications'
        render={(field) => (
          <div className='space-y-4'>
            <div className=''>
              <field.Label>Notifications</field.Label>
              <field.Detail>
                Which of these would you like to receive?
              </field.Detail>
            </div>
            <ul className='space-y-2'>
              {['news', 'promotions', 'updates'].map((notification) => (
                <li key={notification} className='flex items-center space-x-2'>
                  <field.Controller>
                    <Checkbox
                      id={notification}
                      checked={field.state.value.includes(notification)}
                      onCheckedChange={() => {
                        field.handleChange(
                          field.state.value.includes(notification)
                            ? field.state.value.filter(
                              (v) => v !== notification,
                            )
                            : [...field.state.value, notification],
                        )
                      }}
                    />
                  </field.Controller>
                  <field.Label htmlFor={notification}>
                    {notification}
                  </field.Label>
                </li>
              ))}
            </ul>
          </div>
        )}
      />
      <form.Submit>Submit</form.Submit>
    </form.Root>
  )
}
