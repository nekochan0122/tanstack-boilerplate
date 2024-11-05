import type { ComponentProps, FunctionComponent, ReactNode } from 'react'
import type { Except, Simplify, UnknownRecord } from 'type-fest'

import type { DeepKeyValueName, Form, FormFieldProps, Submit } from '~/components/ui/form'

type BuilderBaseConfig<SubmitProps> = { submit: SubmitProps | ReactNode }

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
  TBaseComponents extends BuilderBaseComponents,
  TFiledComponents extends BuilderFieldComponents,
>(components: { base: TBaseComponents; fields: TFiledComponents }) {

  return function createFormBuilder<
    TFormData,
    TName extends DeepKeyValueName<TFormData, any>,
  >(form: FormFieldProps<TFormData, TName>['form']) {

    return function configResolver<
      TFormProps = Except<ComponentProps<BuilderBaseComponents['form']>, 'form'>,
      TSubmitProps = Except<ComponentProps<BuilderBaseComponents['submit']>, 'form'>,
      TBuilderConfig extends BuilderFieldsConfig = InferBuilderConfig<
        InferBuilderComponentsProps<TFiledComponents, TFormData, TName>
      >[],
    >(config: { base: BuilderBaseConfig<TSubmitProps>; fields: TBuilderConfig }) {
      const submitProps = typeof config.base.submit !== 'object'
        ? { children: config.base.submit as ReactNode }
        : config.base.submit as TSubmitProps

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
            <SubmitComponent form={form}{...submitProps} />
          </FormComponent>
        )
      }
    }
  }
}

export { createFormBuilderFactory }
export type { InferBuilderComponentsProps, InferBuilderConfig }
