import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Textarea } from '#/components/ui/textarea.tsx'
import { FORM_TEXTAREA_CLASS } from '#/components/admin/common/form-styles.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

const copy = EMPLOYER_CONTENT.notesStep

export function NotesStep() {
  const form = useFormContext<EmployerFormValues>()

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 sm:text-sm">
        {copy.heading}
      </h3>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-bold text-slate-900 sm:text-base">
              {copy.notesLabel}
            </FormLabel>
            <FormControl>
              <Textarea
                id="employer-notes-body"
                placeholder={copy.notesPlaceholder}
                className={FORM_TEXTAREA_CLASS}
                maxLength={2000}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
