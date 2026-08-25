export interface TextSchemaOptions {
  max?: number
  maxMessage?: string
  pattern?: RegExp
  patternMessage?: string
}

export type RequiredTextSchemaOptions = TextSchemaOptions
export type OptionalTextSchemaOptions = TextSchemaOptions

export interface EmailSchemaOptions {
  max?: number
  maxMessage?: string
}

export type RequiredEmailSchemaOptions = EmailSchemaOptions
export type OptionalEmailSchemaOptions = EmailSchemaOptions

export interface NotesSchemaOptions {
  max?: number
  maxMessage?: string
}

export type OptionalNotesSchemaOptions = NotesSchemaOptions
