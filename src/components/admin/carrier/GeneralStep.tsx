import { useFormContext } from 'react-hook-form'

import { Checkbox } from '#/components/ui/checkbox.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { FORM_INPUT_CLASS } from '#/components/admin/common/form-styles'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { cn } from '#/lib/utils.ts'
import type { CarrierFormValues } from '#/components/admin/carrier/carrier.schema.ts'

const copy = CARRIER_CONTENT.generalStep

const LABEL_COL =
  'text-left sm:text-right text-sm font-semibold text-slate-700 sm:pt-2 pt-0'

function handleFiveDigitInput(
  value: string,
  onChange: (value: string) => void,
) {
  onChange(value.replace(/\D/g, '').slice(0, 5))
}

export function GeneralStep() {
  const form = useFormContext<CarrierFormValues>()
  const {
    data: states,
    isLoading: statesLoading,
    isError: statesError,
  } = useGetStates()

  return (
    <div className="space-y-6">
      {/* Name (required) */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(
                LABEL_COL,
                'after:ml-0.5 after:text-destructive after:content-["*"]',
              )}
            >
              {copy.nameLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="carrier-name"
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

      {/* Group Title (required) */}
      <FormField
        control={form.control}
        name="groupTitle"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(
                LABEL_COL,
                'after:ml-0.5 after:text-destructive after:content-["*"]',
              )}
            >
              {copy.groupTitleLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="carrier-group-title"
                  placeholder={copy.groupTitlePlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Allow Flexible Dates */}
      <FormField
        control={form.control}
        name="allowFlexibleDates"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.allowFlexibleDatesLabel}
            </FormLabel>
            <div className="flex h-9 items-center">
              <FormControl>
                <Checkbox
                  id="carrier-allow-flexible-dates"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <Separator />

      {/* Additional Details section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {copy.additionalDetailsHeading}
        </h3>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
          {/* Address 1 */}
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>
                  {copy.address1Label}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-address1"
                      placeholder={copy.address1Placeholder}
                      className={FORM_INPUT_CLASS}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Address 2 */}
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>
                  {copy.address2Label}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-address2"
                      placeholder={copy.address2Placeholder}
                      className={FORM_INPUT_CLASS}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>{copy.cityLabel}</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-city"
                      placeholder={copy.cityPlaceholder}
                      className={FORM_INPUT_CLASS}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>{copy.stateLabel}</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={statesLoading}
                    >
                      <SelectTrigger
                        id="carrier-state"
                        className="h-9 w-full rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
                      >
                        <SelectValue
                          placeholder={
                            statesLoading
                              ? copy.stateLoadingPlaceholder
                              : copy.stateSelectPlaceholder
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {statesError ? (
                    <p className="text-xs font-medium text-destructive">
                      {copy.stateLoadError}
                    </p>
                  ) : null}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Zip */}
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>
                  {copy.zipCodeLabel}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-zip"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder={copy.zipCodePlaceholder}
                      className={FORM_INPUT_CLASS}
                      {...field}
                      onChange={(event) =>
                        handleFiveDigitInput(event.target.value, field.onChange)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
