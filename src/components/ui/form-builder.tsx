// TODO: support submit props

import type { ComponentProps, FunctionComponent } from 'react'
import type { Except, Simplify, UnknownRecord } from 'type-fest'

import type { DeepKeyValueName, Form, FormFieldProps, Submit } from '~/components/ui/form'

type BuilderBaseConfig = { submit: string }

type BuilderFieldsConfig = { type: string; name: string }[]

type BuilderBaseComponents = { form: typeof Form; submit: typeof Submit }

type BuilderFieldComponents = Record<string, FunctionComponent<any>>

type BuilderFieldComponentsProps = Record<string, UnknownRecord>

type InferBuilderComponentsProps<
  TComponents extends BuilderFieldComponents,
  TFormData,
  TName extends DeepKeyValueName<TFormData, any>,
> = {
  [K in keyof TComponents]: Simplify<
    Except<
      ComponentProps<TComponents[K]>,
      keyof FormFieldProps<any, any>
    > &
    Except<
      FormFieldProps<TFormData, TName>,
      'form'
    >
  >
}

type InferBuilderConfig<
  ComponentsProps extends BuilderFieldComponentsProps,
> = Simplify<
  {
    [K in keyof ComponentsProps]: {
      type: K
    } & ComponentsProps[K]
  }[keyof ComponentsProps]
>

function createFormBuilderFactory<
  TFiledComponents extends BuilderFieldComponents,
>(components: { base: BuilderBaseComponents; fields: TFiledComponents }) {

  return function createFormBuilder<
    TFormData,
    TName extends DeepKeyValueName<TFormData, any>,
    TBuilderConfig extends BuilderFieldsConfig = InferBuilderConfig<
      InferBuilderComponentsProps<TFiledComponents, TFormData, TName>
    >[],
  >(form: FormFieldProps<TFormData, TName>['form']) {

    return function configResolver<
      TFormProps = Except<ComponentProps<BuilderBaseComponents['form']>, 'form'>,
    >(config: { base: BuilderBaseConfig; fields: TBuilderConfig }) {

      return function FormBuilder(formProps: TFormProps) {
        const FormComponent = components.base.form
        const SubmitComponent = components.base.submit

        return (
          <FormComponent form={form} {...formProps}>
            {config.fields.map((fieldConfig) => {
              const FieldComponent = components.fields[fieldConfig.type]
              if (!FieldComponent) throw new Error(`Can't find the field component: ${fieldConfig.type}.`)
              return <FieldComponent key={fieldConfig.name} form={form} {...fieldConfig} />
            })}
            <SubmitComponent form={form}>
              {config.base.submit}
            </SubmitComponent>
          </FormComponent>
        )
      }
    }
  }
}

export { createFormBuilderFactory }
export type { InferBuilderComponentsProps, InferBuilderConfig }
