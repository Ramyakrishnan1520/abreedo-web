import { useFormContext } from 'react-hook-form'

import { Checkbox } from '#/components/ui/checkbox.tsx'
import { Textarea } from '#/components/ui/textarea.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { FORM_TEXTAREA_CLASS } from '#/components/admin/parent-company/form-styles.ts'
import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

export function NotesStep() {
  const form = useFormContext<ParentCompanyFormValues>()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Important Notes</h3>
        <p className="mt-1 text-sm text-slate-600">
          Add any additional information that should be recorded for this parent
          company.
        </p>
      </div>

      <Separator />

      <FormField
        control={form.control}
        name="allowCobra"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3 space-y-0 pt-2">
            <FormLabel className="text-base font-bold text-slate-900 cursor-pointer">
              Allow Cobra
            </FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Paragraph describing any additional information needed"
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
