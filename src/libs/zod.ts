import { z } from 'zod'
import type { IsEqual } from 'type-fest'

import { logger } from '~/libs/logger'

export type InferZodObjectShape<T extends object> = {
  [Key in keyof T]-?: IsEqual<T[Key], Exclude<T[Key], undefined>> extends false
    ? z.ZodOptional<z.ZodType<T[Key]>> | z.ZodPipeline<z.ZodOptional<z.ZodAny>, z.ZodType<T[Key]>>
    : z.ZodType<T[Key]> | z.ZodPipeline<z.ZodAny, z.ZodType<T[Key]>>
}

export function formatZodErrors(error: z.ZodError): string[] {
  if (error.issues.length) {
    return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
  }

  throw new Error('Invalid ZodError')
}

export function handleZodErrors(error: z.ZodError) {
  for (const message of formatZodErrors(error)) {
    logger.error(message)
  }
}

export function isValidZodLiteralUnion<T extends z.ZodLiteral<unknown>>(
  literals: T[],
): literals is [T, T, ...T[]] {
  return literals.length >= 2
}

export function constructZodLiteralUnionType<T extends z.Primitive>(
  constArray: readonly T[],
) {
  const literalsArray = constArray.map((literal) => z.literal(literal))
  if (!isValidZodLiteralUnion(literalsArray)) {
    throw new Error(
      'Literals passed do not meet the criteria for constructing a union schema, the minimum length is 2',
    )
  }
  return z.union(literalsArray)
}
