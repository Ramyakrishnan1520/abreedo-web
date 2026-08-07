import { useFormContext } from 'react-hook-form'

import { Input } from '#/components/ui/input.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { FORM_INPUT_CLASS, LABEL_COL } from '#/components/admin/common/form-styles'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import type { CarrierFormValues } from '#/components/admin/carrier/carrier.schema.ts'

const copy = CARRIER_CONTENT.contactStep

export function ContactStep() {
  const form = useFormContext<CarrierFormValues>()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">{copy.heading}</h3>
        <p className="text-sm text-slate-500">{copy.description}</p>
      </div>

      <div className="space-y-4">
        {/* Contact First Name */}
        <FormField
          control={form.control}
          name="contactFirstName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={LABEL_COL}>{copy.firstNameLabel}</FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="carrier-contact-first-name"
                    placeholder={copy.firstNamePlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Contact Last Name */}
        <FormField
          control={form.control}
          name="contactLastName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={LABEL_COL}>{copy.lastNameLabel}</FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="carrier-contact-last-name"
                    placeholder={copy.lastNamePlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={LABEL_COL}>{copy.phoneLabel}</FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="carrier-phone"
                    type="tel"
                    placeholder={copy.phonePlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Fax */}
        <FormField
          control={form.control}
          name="fax"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={LABEL_COL}>{copy.faxLabel}</FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="carrier-fax"
                    type="tel"
                    placeholder={copy.faxPlaceholder}
                    className={FORM_INPUT_CLASS}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
              <FormLabel className={LABEL_COL}>{copy.emailLabel}</FormLabel>
              <div className="space-y-1">
                <FormControl>
                  <Input
                    id="carrier-email"
                    type="email"
                    placeholder={copy.emailPlaceholder}
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
    </div>
  )
}
