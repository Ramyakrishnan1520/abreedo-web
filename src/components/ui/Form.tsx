import * as React from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
} from 'react-hook-form'

import { cn } from '#/lib/utils.ts'
import { Label } from '#/components/ui/label.tsx'

import type {
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form'
import type { Label as LabelPrimitive } from 'radix-ui'

// Re-export FormProvider as Form
const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

// Wraps Controller and provides field name via context
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// Hook to read field context and form state inside a FormItem
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error('useFormField must be used within <FormField>')
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

// Context to share the generated id between FormItem and its children
type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

// Container that generates a stable id for label/input linkage
function FormItem({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-1', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

// Label that turns red when the field has an error
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn(
        'data-[error=true]:text-destructive',
        className,
      )}
      htmlFor={formItemId}
      {...props}
    />
  )
}

// Wrapper that wires aria-invalid and aria-describedby onto its child
function FormControl({ ...props }: React.ComponentProps<'div'>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField()

  return (
    <div
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

// Optional helper text shown below a field
function FormDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-xs', className)}
      {...props}
    />
  )
}

// Shows the validation error message (or children if no error)
function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? '') : children

  if (!body) return null

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-xs font-medium', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
