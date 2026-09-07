import { useFormContext } from 'react-hook-form'

import { Textarea } from '#/components/ui/textarea.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { FORM_TEXTAREA_CLASS } from '#/components/admin/common/form-styles.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'

export function NotesStep() {
  const form = useFormContext<CoverageCodeFormValues>()
  const copy = COVERAGE_CODE_CONTENT.notesStep

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
                id="coverage-notes"
                placeholder={copy.placeholder}
                className={FORM_TEXTAREA_CLASS}
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
