import { scheduler } from 'node:timers/promises'

import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { toast } from 'sonner'
import { z } from 'zod'

import { createBasicFormBuilder } from '~/components/form/basic'
import { useForm } from '~/components/ui/form'

export const Route = createFileRoute('/(form)/form')({
  component: FormRoute,
})

const exampleSchema = z
  .object({
    text: z.string(),
    textOptional: z.string().optional(),
    textDisabled: z.string(),
    url: z.string().url(),
    email: z.string().email(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    number: z.number(),
    numberLimit: z.number().min(0).max(10),
    password: z.string(),
    passwordConfirm: z.string(),
    checkbox: z.boolean(),
    date: z.date(),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords must match!',
  })
  .refine((values) => values.checkbox, {
    path: ['checkbox'],
    message: 'You must accept this checkbox',
  })

const exampleServerFn = createServerFn(
  'POST',
  async (input: z.infer<typeof exampleSchema>) => {
    await scheduler.wait(1000)

    console.log(input)

    const parsedInput = exampleSchema.parse(input)

    console.log(parsedInput)
  },
)

function FormRoute() {
  const exampleMutation = useMutation({
    mutationKey: ['example'],
    mutationFn: exampleServerFn,
  })

  const form = useForm(exampleSchema, {
    defaultValues: {
      text: 'Hello World!',
      textOptional: undefined,
      textDisabled: 'You can\'t edit me',
      url: 'https://example.com',
      email: 'me@example.com',
      phone: '+886901234567',
      number: 1,
      numberLimit: 5,
      password: 'MyPassword',
      passwordConfirm: 'MyPassword',
      checkbox: true,
      date: new Date(),
    },
    onSubmit: async ({ value, formApi }) => {
      console.log(value)

      const submitPromise = exampleMutation.mutateAsync(value, {
        onSuccess: () => {
          formApi.reset()
        },
      })

      toast.promise(submitPromise, {
        loading: 'Submitting...',
        success: 'Submitted successfully',
        error: 'Failed to submit',
      })

      await submitPromise
    },
  })

  const FormBuilder = createBasicFormBuilder(form)({
    base: {
      submit: 'Submit',
    },
    fields: [
      {
        type: 'text',
        name: 'text',
        label: 'Text ',
      },
      {
        type: 'text',
        name: 'textOptional',
        label: 'Text Optional',
      },
      {
        type: 'text',
        name: 'textDisabled',
        label: 'Text Disabled',
        disabled: true,
        validators: {
          onChange: z.literal(form.options.defaultValues?.textDisabled),
        },
      },
      {
        type: 'text',
        name: 'url',
        label: 'URL ',
        inputProps: {
          type: 'url',
        },
      },
      {
        type: 'text',
        name: 'email',
        label: 'Email ',
        inputProps: {
          type: 'email',
        },
      },
      {
        type: 'phone',
        name: 'phone',
        label: 'Phone ',
      },
      {
        type: 'number',
        name: 'number',
        label: 'Number ',
      },
      {
        type: 'number',
        name: 'numberLimit',
        label: 'Number Limit',
      },
      {
        type: 'password',
        name: 'password',
        label: 'Password ',
      },
      {
        type: 'password',
        name: 'passwordConfirm',
        label: 'Password Confirm',
      },
      {
        type: 'checkbox',
        name: 'checkbox',
        label: 'Checkbox',
        description: 'You must accept this checkbox',
      },
      {
        type: 'date',
        name: 'date',
        label: 'Date',
      },
    ],
  })

  return (
    <>
      <FormBuilder />
    </>
  )
}
