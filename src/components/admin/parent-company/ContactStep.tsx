import { useFormContext } from 'react-hook-form'

import { Input } from '#/components/ui/input.tsx'
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
  FORM_LABEL_CLASS,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/parent-company/form-styles.ts'
import { PARENT_COMPANY_CONTENT } from '#/content/admin/parent-company-content.ts'
import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

const copy = PARENT_COMPANY_CONTENT.contactStep

function handleTenDigitInput(
  value: string,
  onChange: (value: string) => void,
) {
  onChange(value.replace(/\D/g, '').slice(0, 10))
}

export function ContactStep() {
  const form = useFormContext<ParentCompanyFormValues>()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">{copy.heading}</h3>
        <p className="mt-1 text-sm text-slate-600">{copy.description}</p>
      </div>

      <Separator />

      <FormField
        control={form.control}
        name="contact.firstName"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.firstNameLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
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

      <FormField
        control={form.control}
        name="contact.lastName"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.lastNameLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
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

      <FormField
        control={form.control}
        name="contact.phoneNumber"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.phoneLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder={copy.phonePlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                  onChange={(event) =>
                    handleTenDigitInput(event.target.value, field.onChange)
                  }
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact.alternativePhoneNumber"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.alternativePhoneLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder={copy.phonePlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                  onChange={(event) =>
                    handleTenDigitInput(event.target.value, field.onChange)
                  }
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact.fax"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>{copy.faxLabel}</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder={copy.phonePlaceholder}
                  className={FORM_INPUT_CLASS}
                  {...field}
                  onChange={(event) =>
                    handleTenDigitInput(event.target.value, field.onChange)
                  }
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact.email"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.emailLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
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

      <FormField
        control={form.control}
        name="contact.website"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={FORM_LABEL_CLASS}>{copy.websiteLabel}</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="url"
                  placeholder={copy.websitePlaceholder}
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
