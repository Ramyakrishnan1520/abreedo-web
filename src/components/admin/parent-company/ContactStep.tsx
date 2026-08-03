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
import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

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
        <h3 className="text-base font-bold text-slate-900">
          Primary Contact Information
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Enter the main point of contact for this parent company.
        </p>
      </div>

      <Separator />

      <FormField
        control={form.control}
        name="contact.firstName"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              Contact First Name
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  placeholder="ex. John"
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
              Contact Last Name
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  placeholder="ex. Doe"
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
              Contact Phone Number
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="(000) 000-0000"
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
              Alternative Phone Number
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="(000) 000-0000"
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
            <FormLabel className={REQUIRED_LABEL_CLASS}>Fax</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="(000) 000-0000"
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
            <FormLabel className={REQUIRED_LABEL_CLASS}>Email</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="email"
                  placeholder="ex. john.doe@example.com"
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
            <FormLabel className={FORM_LABEL_CLASS}>Website</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="url"
                  placeholder="ex. https://yourcompany.com"
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
