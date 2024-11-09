// https://github.com/TanStack/form/blob/demo-internal-components/examples/react/custom-component-wrapper/src/index.tsx

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/react-form-zod-adapter'
import { isEqual } from 'es-toolkit'
import type { DeepKeys, DeepValue, FieldApi, FieldOptions, FormApi, FormOptions, ReactFormApi, Validator } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import type { Except, UnknownRecord } from 'type-fest'
import type { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { cx } from '~/libs/utils'
import type { ButtonProps } from '~/components/ui/button'
import type { Calendar } from '~/components/ui/calendar'
import type { Checkbox } from '~/components/ui/checkbox'
import type { Input } from '~/components/ui/input'
import type { InputPhone } from '~/components/ui/input-phone'

function useFormWithZod<
  TFormSchema extends z.ZodType,
  TFormData = z.infer<TFormSchema>,
>(
  schema: TFormSchema,
  options?: Except<FormOptions<TFormData, Validator<TFormData, TFormSchema>>, 'validatorAdapter'>,
) {
  return useForm({
    validatorAdapter: zodValidator({
      transformErrors: (errors) => errors.map((e) => e.message)[0],
    }),
    validators: {
      onChange: schema,
    },
    ...options,
  })
}

// https://github.com/TanStack/form/blob/2adadbf80b3c82802a83a53bba6fec2d09f54e97/packages/form-core/src/util-types.ts#L147
type SelfKeys<T> = {
  [K in keyof T]: K
}[keyof T]

// https://github.com/TanStack/form/blob/2adadbf80b3c82802a83a53bba6fec2d09f54e97/packages/form-core/src/util-types.ts#L153
type DeepKeyValueName<TFormData, TField = any> = SelfKeys<{
  [K in DeepKeys<TFormData> as DeepValue<TFormData, K> extends TField ? K : never]: K
}>

type AnyFormApi = FormApi<any, any>

type AnyReactFormApi = ReactFormApi<any, any>

type AnyReactFormApiMerged = AnyFormApi & AnyReactFormApi

type AnyFieldApi = FieldApi<any, any, any, any>

type FieldController = Record<string, (form: AnyReactFormApiMerged, field: AnyFieldApi) => UnknownRecord>

const fieldControllerBase = (form: AnyReactFormApiMerged, field: AnyFieldApi) => ({
  id: field.name,
  name: field.name,
  onBlur: field.handleBlur,
  disabled: form.state.isSubmitting,
})

const fieldController = {
  input: (form, field) => ({
    ...fieldControllerBase(form, field),
    value: field.state.value ?? '',
    onChange: (e) => {
      const isEmpty = e.target.value.length === 0
      const isOptional = form.options.defaultValues[field.name] === undefined

      const inputMode = e.target.inputMode as ComponentProps<typeof Input>['inputMode']
      const inputValue = (() => {
        let parsedNumber: number
        switch (inputMode) {
          case 'numeric':
            parsedNumber = parseInt(e.target.value)
            return isNaN(parsedNumber) ? e.target.value : parsedNumber
          case 'decimal':
            parsedNumber = parseFloat(e.target.value)
            return isNaN(parsedNumber) ? e.target.value : parsedNumber
          default:
            return e.target.value
        }
      })()

      if (isOptional) {
        field.handleChange(isEmpty ? undefined : inputValue)
      }
      else {
        field.handleChange(inputValue)
      }
    },
  }) satisfies ComponentProps<typeof Input>,
  phone: (form, field) => ({
    ...fieldControllerBase(form, field),
    value: field.state.value ?? '',
    onChange: field.handleChange,
  }) satisfies ComponentProps<typeof InputPhone>,
  checkbox: (form, field) => ({
    ...fieldControllerBase(form, field),
    checked: field.state.value,
    onCheckedChange: field.handleChange,
  }) satisfies ComponentProps<typeof Checkbox>,
  calendar: (form, field) => ({
    ...fieldControllerBase(form, field),
    selected: field.state.value,
    onSelect: field.handleChange,
  }) satisfies ComponentProps<typeof Calendar>,
} satisfies FieldController

type FormProps = Except<ComponentProps<'form'>, 'action'> & {
  form: AnyReactFormApiMerged
}

function Form({ form, className, ...props }: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className={cx('w-full', className)}
      autoComplete='off'
      {...props}
    />
  )
}

type SubmitProps = Except<ButtonProps, 'form'> & {
  form: AnyReactFormApiMerged
  allowDefaultValues?: boolean
}

function Submit({ form, allowDefaultValues = import.meta.env.DEV, ...props }: SubmitProps) {
  const store = form.useStore()
  const isDefaultValues = isEqual(form.options.defaultValues, store.values)

  return (
    <form.Subscribe
      selector={(state) => [state.isSubmitting, state.canSubmit]}
      children={([isSubmitting, canSubmit]) => (
        <Button
          type='submit'
          disabled={(allowDefaultValues ? false : isDefaultValues) || isSubmitting || !canSubmit}
          {...props}
        />
      )}
    />
  )
}

// to define the components of the form.Field
type FormFieldProps<
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
> = Except<FieldOptions<TFormData, TName, Validator<any, z.ZodTypeAny>>, 'validatorAdapter'> & {
  form: AnyFormApi & ReactFormApi<TFormData, any>
}

// to define the components inside the form.Field children
type FieldBaseProps = {
  field: AnyFieldApi
}

type FieldLabelProps = ComponentProps<typeof Label> & FieldBaseProps & {
  label: string
}

function FieldLabel({ field, label, className, ...props }: FieldLabelProps) {
  const isDefaultValue = field.form.options.defaultValues[field.name] === field.state.value

  return (
    <Label
      htmlFor={field.name}
      className={cx(className,
        field.state.meta.isTouched && field.state.meta.errors.length > 0 && 'text-destructive',
      )}
      {...props}
    >
      {label} {!isDefaultValue && field.state.meta.isTouched ? '*' : null}
    </Label>
  )
}

type FieldInfoProps = FieldBaseProps & {
  placeholder?: string
}

function FieldInfo({ field, placeholder }: FieldInfoProps) {
  const isTouched = field.state.meta.isTouched
  const hasErrors = field.state.meta.errors.length > 0

  const info = isTouched && hasErrors
    ? field.state.meta.errors[0]
    : placeholder

  return (
    <p className={cx(
      'text-sm',
      isTouched && hasErrors ? 'text-destructive' : 'text-muted-foreground',
    )}
    >
      {typeof info === 'string' && info.length > 0 ? info : undefined}
    </p>
  )
}

export { fieldController }
export { useFormWithZod as useForm }
export { FieldInfo, FieldLabel, Form, Submit }
export type { AnyFieldApi, AnyFormApi, AnyReactFormApi, AnyReactFormApiMerged, DeepKeyValueName, FieldLabelProps, FormFieldProps, FormProps, SubmitProps }
