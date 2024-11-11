import type { ComponentProps } from 'react'

import { Checkbox } from '~/components/ui/checkbox'
import { DatePicker } from '~/components/ui/date-picker'
import { fieldController, FieldInfo, FieldLabel, Form, Submit } from '~/components/ui/form'
import { createFormBuilderFactory } from '~/components/ui/form-builder'
import { Input } from '~/components/ui/input'
import { InputPassword } from '~/components/ui/input-password'
import { InputPhone } from '~/components/ui/input-phone'
import { cx } from '~/libs/utils'
import type { DeepKeyValueName, FieldLabelProps, FormFieldProps, FormProps, SubmitProps } from '~/components/ui/form'

const createBasicFormBuilder = createFormBuilderFactory({
  base: {
    form: BasicForm,
    submit: BaseFormSubmit,
  },
  fields: {
    text: BasicFormTextInput,
    phone: BasicFormPhoneInput,
    number: BasicFormNumberInput,
    password: BasicFormPasswordInput,
    checkbox: BasicFormCheckbox,
    date: BasicFormDatePicker,
  },
})

type BasicFormFieldBaseProps = {
  label: ComponentProps<typeof FieldLabel>['label']
}

type BasicFormInputProps = BasicFormFieldBaseProps & {
  inputProps?: ComponentProps<typeof Input>
}

function BasicFormTextInput<
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
>({ form, label, inputProps, ...fieldProps }:
  FormFieldProps<TFormData, TName> & BasicFormInputProps,
) {
  return (
    <form.Field<TName, any, any>
      {...fieldProps}
      children={(field) => {
        const controller = fieldController.input(form, field)

        return (
          <BasicField>
            <BasicFieldLabel {...({ field, label })} />
            <Input {...controller} {...inputProps} />
            <FieldInfo field={field} />
          </BasicField>
        )
      }}
    />
  )
}

type BasicFormPhoneInputProps = BasicFormFieldBaseProps & {
  inputPhoneProps?: ComponentProps<typeof InputPhone>
}

function BasicFormPhoneInput<
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
>({ form, label, inputPhoneProps, ...fieldProps }:
  FormFieldProps<TFormData, TName> & BasicFormPhoneInputProps,
) {
  return (
    <form.Field<TName, any, any>
      {...fieldProps}
      children={(field) => {
        const controller = fieldController.phone(form, field)

        return (
          <BasicField>
            <BasicFieldLabel {...({ field, label })} />
            <InputPhone type='tel' {...controller} {...inputPhoneProps} />
            <FieldInfo field={field} />
          </BasicField>
        )
      }}
    />
  )
}

function BasicFormNumberInput<
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
>({ form, label, inputProps, ...fieldProps }:
  FormFieldProps<TFormData, TName> & BasicFormInputProps,
) {
  return (
    <form.Field<TName, any, any>
      {...fieldProps}
      children={(field) => {
        const controller = fieldController.input(form, field)

        return (
          <BasicField>
            <BasicFieldLabel {...({ field, label })} />
            <Input type='number' {...controller} {...inputProps} />
            <FieldInfo field={field} />
          </BasicField>
        )
      }}
    />
  )
}

function BasicFormPasswordInput<
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
>({ form, label, inputProps, ...fieldProps }:
  FormFieldProps<TFormData, TName> & BasicFormInputProps,
) {
  return (
    <form.Field<TName, any, any>
      {...fieldProps}
      children={(field) => {
        const controller = fieldController.input(form, field)

        return (
          <BasicField>
            <BasicFieldLabel {...({ field, label })} />
            <InputPassword {...controller} {...inputProps} />
            <FieldInfo field={field} />
          </BasicField>
        )
      }}
    />
  )
}

type BasicFormCheckboxProps = BasicFormFieldBaseProps & {
  description: string
  checkboxProps?: ComponentProps<typeof Checkbox>
}

function BasicFormCheckbox<
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
>({ form, label, description, checkboxProps, ...fieldProps }:
  FormFieldProps<TFormData, TName> & BasicFormCheckboxProps,
) {
  return (
    <form.Field<TName, any, any>
      {...fieldProps}
      children={(field) => {
        const controller = fieldController.checkbox(form, field)

        return (
          <BasicField>
            <BasicFieldLabel {...({ field, label })} />
            <div className='flex items-center gap-3'>
              <Checkbox {...controller} {...checkboxProps} />
              <p className='text-muted-foreground'>
                {description}
              </p>
            </div>
            <FieldInfo field={field} />
          </BasicField>
        )
      }}
    />
  )
}

type BasicFormDatePickerProps = BasicFormFieldBaseProps & {
  datePickerProps?: ComponentProps<typeof DatePicker>
}

function BasicFormDatePicker<
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
>({ form, label, datePickerProps, ...fieldProps }:
  FormFieldProps<TFormData, TName> & BasicFormDatePickerProps,
) {
  return (
    <form.Field<TName, any, any>
      {...fieldProps}
      children={(field) => {
        const controller = fieldController.calendar(form, field)

        return (
          <BasicField>
            <BasicFieldLabel {...({ field, label })} />
            <DatePicker
              id={controller.id}
              name={controller.name}
              {...datePickerProps}
              calendar={{
                ...fieldController.calendar(form, field),
                ...datePickerProps?.calendar,
              }}
              className={cx(datePickerProps?.className)}
            />
            <FieldInfo field={field} />
          </BasicField>
        )
      }}
    />
  )
}

function BasicForm({ className, ...props }: FormProps) {
  return (
    <Form className={cx('space-y-4 lg:max-w-sm', className)} {...props} />
  )
}

function BaseFormSubmit({ className, ...props }: SubmitProps) {
  return (
    <Submit className={cx('w-full', className)} {...props} />
  )
}

function BasicField({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cx('flex flex-col gap-y-4', className)} {...props} />
  )
}

function BasicFieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <FieldLabel className={cx('text-lg font-semibold', className)} {...props} />
  )
}

export { createBasicFormBuilder }
export { BasicFormCheckbox, BasicFormDatePicker, BasicFormPasswordInput, BasicFormPhoneInput, BasicFormTextInput }
export { BaseFormSubmit, BasicField, BasicFieldLabel, BasicForm }
