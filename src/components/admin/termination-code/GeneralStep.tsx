import { useFormContext } from 'react-hook-form'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Input } from '#/components/ui/input.tsx'
import { NumberStepper } from '#/components/ui/number-stepper.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { TerminationCodeFormValues } from '#/components/admin/termination-code/termination-code.schema.ts'

const copy = TERMINATION_CODE_CONTENT.generalStep

export function GeneralStep() {
  const form = useFormContext<TerminationCodeFormValues>()
  const cobraNotice = form.watch('cobraNotice')
  const cobraTerm = form.watch('cobraTerm')

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">{copy.heading}</h3>
        <p className="text-sm text-slate-500">{copy.description}</p>
      </div>

      <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        {/* Termination Code (Required) */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={REQUIRED_LABEL_CLASS}>
                {copy.codeLabel}
              </FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="termination-code-input"
                    placeholder={copy.codePlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Separator className="my-4 border-slate-100" />

        {/* Additional Details Heading */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-tan-dark">
            {copy.additionalDetailsHeading}
          </h4>
        </div>

        {/* Name (Required) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={REQUIRED_LABEL_CLASS}>
                {copy.nameLabel}
              </FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="termination-name-input"
                    placeholder={copy.namePlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* BCC Code */}
        <FormField
          control={form.control}
          name="bccCode"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={LABEL_COL}>{copy.bccCodeLabel}</FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="termination-bcc-input"
                    placeholder={copy.bccCodePlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* NEPA Code */}
        <FormField
          control={form.control}
          name="nepaCode"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={LABEL_COL}>{copy.nepaCodeLabel}</FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="termination-nepa-input"
                    placeholder={copy.nepaCodePlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* COBRA Notice Field: Both Yes and No Checkboxes */}
        <FormField
          control={form.control}
          name="cobraNotice"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-4">
              <FormLabel className={LABEL_COL}>
                {copy.cobraNoticeLabel}
              </FormLabel>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      id="termination-cobra-notice-yes-checkbox"
                      checked={field.value === true}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange(true)
                        }
                      }}
                    />
                  </FormControl>
                  <label
                    htmlFor="termination-cobra-notice-yes-checkbox"
                    className="cursor-pointer text-sm font-medium text-slate-700"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      id="termination-cobra-notice-no-checkbox"
                      checked={field.value === false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange(false)
                          form.setValue('cobraTerm', '18months')
                          form.setValue('cobraMonths', 0)
                        }
                      }}
                    />
                  </FormControl>
                  <label
                    htmlFor="termination-cobra-notice-no-checkbox"
                    className="cursor-pointer text-sm font-medium text-slate-700"
                  >
                    No
                  </label>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Conditional COBRA Flow: Only show COBRA Term when COBRA Notice is Yes */}
        {cobraNotice ? (
          <>
            <FormField
              control={form.control}
              name="cobraTerm"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                  <FormLabel className={LABEL_COL}>
                    {copy.cobraTermLabel}
                  </FormLabel>
                  <div className="space-y-1">
                    <FormControl>
                      <ConfigurableSelect
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val)
                          if (val === '18months') {
                            form.setValue('cobraMonths', 18)
                          } else if (val === '36months') {
                            form.setValue('cobraMonths', 36)
                          } else if (val === 'non-standard') {
                            form.setValue('cobraMonths', 0)
                          }
                        }}
                        options={[...copy.cobraTermOptions]}
                        placeholder={copy.cobraTermPlaceholder}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Conditional COBRA Month Stepper: Only show when COBRA Term is non-standard */}
            {cobraTerm === 'non-standard' ? (
              <FormField
                control={form.control}
                name="cobraMonths"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                    <FormLabel className={LABEL_COL}>
                      {copy.cobraMonthsLabel}
                    </FormLabel>
                    <div className="space-y-1">
                      <FormControl>
                        <NumberStepper
                          id="termination-cobra-months-input"
                          value={field.value ?? 0}
                          onChange={(val) => field.onChange(val)}
                          min={0}
                          max={120}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
