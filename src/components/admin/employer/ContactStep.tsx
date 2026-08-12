import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Input } from '#/components/ui/input.tsx'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

const copy = EMPLOYER_CONTENT.contactStep

export function ContactStep() {
  const form = useFormContext<EmployerFormValues>()

  return (
    <div className="space-y-6">
      {/* Contact First Name */}
      <FormField
        control={form.control}
        name="contactFirst"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.firstNameLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-contact-first"
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
        name="contactLast"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.lastNameLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-contact-last"
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

      {/* Title */}
      <FormField
        control={form.control}
        name="contactTitle"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={LABEL_COL}>
              {copy.titleLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-contact-title"
                  placeholder={copy.titlePlaceholder}
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
            <FormLabel className={LABEL_COL}>
              {copy.phoneLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-contact-phone"
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
            <FormLabel className={LABEL_COL}>
              {copy.faxLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-contact-fax"
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
            <FormLabel className={LABEL_COL}>
              {copy.emailLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="employer-contact-email"
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
  )
}
