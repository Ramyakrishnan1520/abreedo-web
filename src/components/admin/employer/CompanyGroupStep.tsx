import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Checkbox } from '#/components/ui/checkbox.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Input } from '#/components/ui/input.tsx'
import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

const copy = EMPLOYER_CONTENT.companyGroupStep

export function CompanyGroupStep() {
  const form = useFormContext<EmployerFormValues>()

  const statusOptions = useMemo(
    () => [
      { value: '1', label: copy.statusActive },
      { value: '0', label: copy.statusInactive },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      {/* Group Number */}
      <FormField
        control={form.control}
        name="groupNumber"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.groupNumberLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-group-number"
                  placeholder={copy.groupNumberPlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Policy Number */}
      <FormField
        control={form.control}
        name="policyNumber"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.policyNumberLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-policy-number"
                  placeholder={copy.policyNumberPlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* TPAC Number */}
      <FormField
        control={form.control}
        name="tpacNumber"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.tpacNumberLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-tpac-number"
                  placeholder={copy.tpacNumberPlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Monthly Admin Fee */}
      <FormField
        control={form.control}
        name="monthlyAdminFee"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.monthlyAdminFeeLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-monthly-fee"
                  type="number"
                  step="1"
                  placeholder={copy.monthlyAdminFeePlaceholder}
                  className={FORM_INPUT_CLASS}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Status */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.statusLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <ConfigurableSelect
                  id="employer-status"
                  value={String(field.value ?? 1)}
                  onValueChange={(val) => field.onChange(Number(val))}
                  options={statusOptions}
                  triggerClassName={FORM_INPUT_CLASS}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Checkboxes Options */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
        <label className={LABEL_COL}>Options</label>
        <div className="flex flex-wrap items-center gap-6 pt-0.5 sm:pt-2">
          {/* Use Paper Invoice */}
          <FormField
            control={form.control}
            name="isPaper"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="employer-is-paper"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <label
                  htmlFor="employer-is-paper"
                  className="cursor-pointer text-sm font-medium text-slate-700"
                >
                  {copy.usePaperInvoiceLabel}
                </label>
              </FormItem>
            )}
          />

          {/* Allow Cobra */}
          <FormField
            control={form.control}
            name="allowCobra"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="employer-allow-cobra"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <label
                  htmlFor="employer-allow-cobra"
                  className="cursor-pointer text-sm font-medium text-slate-700"
                >
                  {copy.allowCobraLabel}
                </label>
              </FormItem>
            )}
          />

          {/* Exact Day */}
          <FormField
            control={form.control}
            name="isPano"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="employer-is-pano"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <label
                  htmlFor="employer-is-pano"
                  className="cursor-pointer text-sm font-medium text-slate-700"
                >
                  {copy.exactDayLabel}
                </label>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Renewal Date */}
      <FormField
        control={form.control}
        name="renewalDate"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.renewalDateLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-renewal-date"
                  type="date"
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Initial Notification Start On */}
      <FormField
        control={form.control}
        name="initialNotificationStartOn"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.initialNotificationStartOnLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-initial-notification-date"
                  type="date"
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
