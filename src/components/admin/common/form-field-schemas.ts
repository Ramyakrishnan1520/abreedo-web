import { z } from 'zod'

import type {
  OptionalEmailSchemaOptions,
  OptionalNotesSchemaOptions,
  OptionalTextSchemaOptions,
  RequiredEmailSchemaOptions,
  RequiredTextSchemaOptions,
} from '#/types/form-field-schemas.ts'

export const PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/
export const ZIP_REGEX = /^\d{5}$/
export const LETTERS_ONLY_REGEX = /^[a-zA-Z\s\-'.]*$/


// Backward-compatible regex aliases
export const FORMATTED_PHONE_REGEX = PHONE_REGEX
export const FORMATTED_ZIP_REGEX = ZIP_REGEX

export function tenDigitPhoneSchema(
  requiredMessage: string,
  digitsMessage: string,
) {
  return z
    .string()
    .min(1, requiredMessage)
    .trim()
    .refine((value) => PHONE_REGEX.test(value), digitsMessage)
}

export function optionalTenDigitPhoneSchema(digitsMessage: string) {
  return z
    .string()
    .trim()
    .refine((val) => !val || PHONE_REGEX.test(val), digitsMessage)
}

export function phoneSchema(
  requiredMessage: string,
  digitsMessage: string,
) {
  return tenDigitPhoneSchema(requiredMessage, digitsMessage)
}

export function optionalPhoneSchema(digitsMessage: string) {
  return optionalTenDigitPhoneSchema(digitsMessage)
}

// Aliases for formatted phone functions
export const formattedPhoneSchema = phoneSchema
export const optionalFormattedPhoneSchema = optionalPhoneSchema

export function fiveDigitZipSchema(
  requiredMessage: string,
  digitsMessage: string,
) {
  return z
    .string()
    .min(1, requiredMessage)
    .trim()
    .refine((value) => ZIP_REGEX.test(value), digitsMessage)
}

export function optionalFiveDigitZipSchema(digitsMessage: string) {
  return z
    .string()
    .trim()
    .refine((val) => !val || ZIP_REGEX.test(val), digitsMessage)
}

export function zipSchema(
  requiredMessage: string,
  digitsMessage: string,
) {
  return fiveDigitZipSchema(requiredMessage, digitsMessage)
}

export function optionalZipSchema(digitsMessage: string) {
  return optionalFiveDigitZipSchema(digitsMessage)
}

// Aliases for formatted zip functions
export const formattedZipSchema = zipSchema
export const optionalFormattedZipSchema = optionalZipSchema

export function requiredTextSchema(
  requiredMessage: string,
  options?: RequiredTextSchemaOptions,
) {
  let schema = z.string().min(1, requiredMessage)

  if (options?.max !== undefined) {
    schema = options.maxMessage
      ? schema.max(options.max, options.maxMessage)
      : schema.max(options.max)
  }

  if (options?.pattern) {
    schema = options.patternMessage
      ? schema.regex(options.pattern, options.patternMessage)
      : schema.regex(options.pattern)
  }

  return schema.trim()
}

export function optionalTextSchema(options?: OptionalTextSchemaOptions) {
  let schema = z.string().trim()

  if (options?.max !== undefined) {
    const max = options.max
    const maxMsg = options.maxMessage
    schema = schema.refine(
      (val) => !val || val.length <= max,
      maxMsg ? { message: maxMsg } : undefined,
    )
  }

  if (options?.pattern) {
    const patternRegex = options.pattern
    const patternMsg = options.patternMessage
    schema = schema.refine(
      (val) => !val || patternRegex.test(val),
      patternMsg ? { message: patternMsg } : undefined,
    )
  }

  return schema
}

export function requiredEmailSchema(
  requiredMessage: string,
  invalidMessage: string,
  options?: RequiredEmailSchemaOptions,
) {
  let schema = z.string().min(1, requiredMessage).email(invalidMessage)

  if (options?.max !== undefined) {
    schema = options.maxMessage
      ? schema.max(options.max, options.maxMessage)
      : schema.max(options.max)
  }

  return schema.trim()
}

export function optionalEmailSchema(
  invalidMessage: string,
  options?: OptionalEmailSchemaOptions,
) {
  let schema = z
    .string()
    .trim()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      invalidMessage,
    )

  if (options?.max !== undefined) {
    const max = options.max
    const maxMsg = options.maxMessage
    schema = schema.refine(
      (val) => !val || val.length <= max,
      maxMsg ? { message: maxMsg } : undefined,
    )
  }

  return schema
}

export function optionalNotesSchema(options?: OptionalNotesSchemaOptions) {
  let schema = z.string().trim()

  if (options?.max !== undefined) {
    const max = options.max
    const maxMsg = options.maxMessage
    schema = schema.refine(
      (val) => !val || val.length <= max,
      maxMsg ? { message: maxMsg } : undefined,
    )
  }

  return schema
}
