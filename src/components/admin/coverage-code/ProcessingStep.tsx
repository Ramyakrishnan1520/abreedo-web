import { useFormContext } from 'react-hook-form'

import { Checkbox } from '#/components/ui/checkbox.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { cn } from '#/lib/utils.ts'
import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'

export function ProcessingStep() {
  const form = useFormContext<CoverageCodeFormValues>()
  const copy = COVERAGE_CODE_CONTENT.processingStep

  return (
    <div className="space-y-6">
      {/* Combination for Bill */}
      <FormField
        control={form.control}
        name="codeInvoice"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.combinationForBillLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="coverage-code-invoice"
                  placeholder={copy.combinationForBillPlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Combination for Reports */}
      <FormField
        control={form.control}
        name="codeReport"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.combinationForReportsLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="coverage-code-report"
                  placeholder={copy.combinationForReportsPlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Use for Bill Checkbox */}
      <FormField
        control={form.control}
        name="invoiceInclude"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-4">
            <FormLabel className={LABEL_COL}>{copy.useForBillLabel}</FormLabel>
            <div className="flex h-9 items-center">
              <FormControl>
                <Checkbox
                  id="coverage-use-for-bill"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.descriptionLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="coverage-description"
                  placeholder={copy.descriptionPlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Short Description */}
      <FormField
        control={form.control}
        name="shortTitle"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.shortDescriptionLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="coverage-short-description"
                  placeholder={copy.shortDescriptionPlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Invoice Group */}
      <FormField
        control={form.control}
        name="invoiceGroup"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.invoiceGroupLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="coverage-invoice-group"
                  placeholder={copy.invoiceGroupPlaceholder}
                  className={FORM_INPUT_CLASS}
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
