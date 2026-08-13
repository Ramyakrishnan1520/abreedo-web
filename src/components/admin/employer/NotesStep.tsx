import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Input } from '#/components/ui/input.tsx'
import { Textarea } from '#/components/ui/textarea.tsx'
import {
  FORM_INPUT_CLASS,
  FORM_TEXTAREA_CLASS,
  LABEL_COL,
} from '#/components/admin/common/form-styles.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

const copy = EMPLOYER_CONTENT.notesStep

export function NotesStep() {
  const form = useFormContext<EmployerFormValues>()

  return (
    <div className="space-y-6">
      {/* Title */}
      <FormField
        control={form.control}
        name="notesTitle"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.titleLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-notes-title"
                  placeholder={copy.titlePlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Notes Textarea */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.notesLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Textarea
                  id="employer-notes-body"
                  placeholder={copy.notesPlaceholder}
                  className={FORM_TEXTAREA_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
