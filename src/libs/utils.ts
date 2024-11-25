/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx } from 'clsx'
import { camelCase } from 'es-toolkit/string'
import { createContext, useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import type { ClassArray } from 'clsx'
import type { JSX } from 'react'
import type { CamelCase, LiteralUnion, Simplify } from 'type-fest'

export type StringNumber = `${number}`
export type StringBoolean = `${boolean}`

export type ExtractUnionStrict<T, U extends T> = Extract<T, U>
export type ExcludeUnionStrict<T, U extends T> = Exclude<T, U>

export function cx(...inputs: ClassArray) {
  return twMerge(clsx(inputs))
}

export function createContextFactory<ContextData>(options?: {
  defaultValue?: ContextData | null
  errorMessage?: string
}) {
  const opts = {
    defaultValue: null,
    errorMessage: 'useContext must be used within a Provider',
    ...options,
  }

  const context = createContext<ContextData | null>(opts.defaultValue)

  function useContextFactory(): ContextData {
    const contextValue = useContext(context)
    if (contextValue === null) {
      throw new Error(opts.errorMessage)
    }
    return contextValue
  }

  return [context.Provider, useContextFactory] as const
}

export function objectKeysTyped<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

type CamelCasedProperties<T> = Simplify<{
  [K in keyof T as CamelCase<K>]: T[K]
}>

export function keysToCamelCase<T extends Record<string, any>>(obj: T): CamelCasedProperties<T> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [camelCase(key), value]),
  ) as CamelCasedProperties<T>
}

type TryCatchResult<E = Error, T = unknown> = [null, T] | [E, null]

export function tryCatchSync<
  E = Error,
  T = unknown,
>(
  fn: () => T,
): TryCatchResult<E, T> {
  try {
    const data = fn()
    return [null, data]
  }
  catch (error) {
    return [error as E, null]
  }
}

export async function tryCatchAsync<
  E = Error,
  T = unknown,
>(
  promise: Promise<T>,
): Promise<TryCatchResult<E, T>> {
  try {
    const data = await promise
    return [null, data]
  }
  catch (error) {
    return [error as E, null]
  }
}

type ErrorUnion<T extends (new (...args: any[]) => any)[]> =
   T extends (new (...args: any[]) => infer U)[] ? U : never

export function tryCatchErrorsSync<
  E extends (new (...args: any[]) => any)[],
  T,
>(
  fn: () => T,
  errorClasses?: E,
): TryCatchResult<ErrorUnion<E>, T> {
  try {
    const data = fn()
    return [null, data]
  }
  catch (error) {
    if (errorClasses?.some((e) => error instanceof e)) {
      return [error as ErrorUnion<E>, null]
    }
    else {
      throw error
    }
  }
}

export async function tryCatchErrorsAsync<
  E extends (new (...args: any[]) => any)[],
  T,
>(
  promise: Promise<T>,
  errorClasses?: E,
): Promise<TryCatchResult<ErrorUnion<E>, T>> {
  try {
    const data = await promise
    return [null, data]
  }
  catch (error) {
    if (errorClasses?.some((e) => error instanceof e)) {
      return [error as ErrorUnion<E>, null]
    }
    else {
      throw error
    }
  }
}

type Meta = JSX.IntrinsicElements['meta']

type ViewportWidthHeightValues = StringNumber | 'device-width' | 'device-height'

type Viewport = {
  'width'?: ViewportWidthHeightValues
  'height'?: ViewportWidthHeightValues
  'initial-scale'?: StringNumber
  'minimum-scale'?: StringNumber
  'maximum-scale'?: StringNumber
  'user-scalable'?: 'yes' | 'no' | '1' | '0'
  'viewport-fit'?: 'auto' | 'contain' | 'cover'
  [key: string]: unknown
}

type ImageMetadata = {
  width?: number
  height?: number
  url?: string
  alt?: string
  format?: LiteralUnion<'jpg' | 'png' | 'webp' | 'gif', string>
}

type OpenGraphType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'product'
  | 'place'
  | 'event'

type TwitterCard =
  | 'summary'
  | 'summary_large_image'

type Metadata = {
  charSet?: LiteralUnion<'utf-8', string>
  title?: string
  description?: string
  viewport?: Viewport
  author?: string
  robots?: string
  keywords?: string
  images?: ImageMetadata[]
  openGraph?: {
    url?: string
    type?: LiteralUnion<OpenGraphType, string>
    locale?: string
  }
  twitter?: {
    site?: string
    card?: LiteralUnion<TwitterCard, string>
  }
}

export function createMetadata(metadata: Metadata): Meta[] {
  const meta: Meta[] = []

  if (metadata.charSet) {
    meta.push({ charSet: metadata.charSet })
  }

  if (metadata.title) {
    meta.push({ title: metadata.title })
  }

  if (metadata.viewport) {
    const viewport = Object
      .entries(metadata.viewport)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')

    meta.push({ name: 'viewport', content: viewport })
  }

  addMetaTag('name', 'description', metadata.description)
  addMetaTag('name', 'author', metadata.author)
  addMetaTag('name', 'robots', metadata.robots)
  addMetaTag('name', 'keywords', metadata.keywords)

  addMetaTag('property', 'og:title', metadata.title)
  addMetaTag('property', 'og:description', metadata.description)
  addMetaTag('property', 'og:url', metadata?.openGraph?.url)
  addMetaTag('property', 'og:type', metadata?.openGraph?.type)
  addMetaTag('property', 'og:locale', metadata?.openGraph?.locale)

  addMetaTag('name', 'twitter:card', metadata?.twitter?.card)
  addMetaTag('name', 'twitter:site', metadata?.twitter?.site)
  addMetaTag('name', 'twitter:title', metadata.title)
  addMetaTag('name', 'twitter:description', metadata.description)

  addMetaTag('name', 'twitter:image', metadata.images?.[0]?.url)
  addMetaTag('name', 'twitter:image:alt', metadata.images?.[0]?.alt)
  addMetaTag('name', 'twitter:image:width', metadata.images?.[0]?.width?.toString())
  addMetaTag('name', 'twitter:image:height', metadata.images?.[0]?.height?.toString())

  for (const image of metadata?.images || []) {
    addMetaTag('property', 'og:image', image.url)
    addMetaTag('property', 'og:image:alt', image.alt)
    addMetaTag('property', 'og:image:type', image.format)
    addMetaTag('property', 'og:image:width', image.width?.toString())
    addMetaTag('property', 'og:image:height', image.height?.toString())
  }

  function addMetaTag(keyType: 'name' | 'property', keyName: string, content?: string) {
    if (typeof content === 'string' && content?.trim() !== '') {
      meta.push({ [keyType]: keyName, content })
    }
  }

  return meta
}
