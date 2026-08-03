import { useFormContext } from 'react-hook-form'

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
import {
  FORM_INPUT_CLASS,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/parent-company/form-styles.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

const copy = PARENT_COMPANY_CONTENT.generalStep

function handleFiveDigitInput(
  value: string,
  onChange: (value: string) => void,
) {
  onChange(value.replace(/\D/g, '').slice(0, 5))
}

export function GeneralStep() {
  const form = useFormContext<ParentCompanyFormValues>()
  const {
    data: states,
    isLoading: statesLoading,
    isError: statesError,
  } = useGetStates()

  return (
    <div className="space-y-6">
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

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              Full Name
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  placeholder="Enter full name"
                  className={FORM_INPUT_CLASS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {copy.additionalDetailsHeading}
        </h3>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
          <p className="text-sm font-semibold text-slate-700">
            {copy.primaryAddressHeading}
          </p>

          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.address1Label}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
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

          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.address2Label}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
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

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.cityLabel}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
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

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.stateLabel}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={statesLoading}
                    >
                      <SelectTrigger className="h-9 w-full rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white">
                        <SelectValue
                          placeholder={
                            statesLoading
                              ? copy.stateLoadingPlaceholder
                              : copy.stateSelectPlaceholder
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states?.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
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

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.zipCodeLabel}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
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
