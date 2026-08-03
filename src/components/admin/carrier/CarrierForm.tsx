import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Loader2 } from 'lucide-react'

import { useCreateCarrier } from '#/hooks/carrier/useCreateCarrier.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'

import { Button } from '#/components/ui/button.tsx'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { cn } from '#/lib/utils.ts'


const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/

const carrierSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or fewer')
    .trim(),

  groupTitle: z
    .string()
    .min(1, 'Group Title is required')
    .max(100, 'Group Title must be 100 characters or fewer')
    .trim(),

  address1: z
    .string()
    .max(200, 'Address must be 200 characters or fewer')
    .optional()
    .or(z.literal('')),

  address2: z
    .string()
    .max(200, 'Address must be 200 characters or fewer')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .max(100, 'City must be 100 characters or fewer')
    .regex(/^[a-zA-Z\s\-'.]*$/, 'City must contain only letters')
    .optional()
    .or(z.literal('')),

  state: z.string().optional(),

  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code (e.g. 12345 or 12345-6789)')
    .optional()
    .or(z.literal('')),

  contactFirstName: z
    .string()
    .max(50, 'First name must be 50 characters or fewer')
    .regex(/^[a-zA-Z\s\-'.]*$/, 'First name must contain only letters')
    .optional()
    .or(z.literal('')),

  contactLastName: z
    .string()
    .max(50, 'Last name must be 50 characters or fewer')
    .regex(/^[a-zA-Z\s\-'.]*$/, 'Last name must contain only letters')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .regex(phoneRegex, 'Enter a valid phone number — (___) ___-____')
    .optional()
    .or(z.literal('')),

  fax: z
    .string()
    .regex(phoneRegex, 'Enter a valid fax number — (___) ___-____')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .email('Enter a valid email address')
    .max(254, 'Email must be 254 characters or fewer')
    .optional()
    .or(z.literal('')),

  allowFlexibleDates: z.boolean().optional(),
})

type CarrierFormValues = z.infer<typeof carrierSchema>

// Props
interface CarrierFormProps {
  defaultValues?: Partial<CarrierFormValues>
  onBack?: () => void
  onSuccess?: () => void
  title?: string
}

const LABEL_COL =
  'sm:text-right text-left text-sm font-semibold text-slate-700 sm:pt-2 pt-0'

export function CarrierForm({
  defaultValues,
  onBack,
  onSuccess,
  title = 'New Carrier',
}: CarrierFormProps) {
  const { mutate: createCarrier, isPending } = useCreateCarrier()
  const { data: states, isLoading: statesLoading, isError: statesError } = useGetStates()

  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(carrierSchema),
    defaultValues: {
      name: '',
      groupTitle: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      contactFirstName: '',
      contactLastName: '',
      phone: '',
      fax: '',
      email: '',
      allowFlexibleDates: false,
      ...defaultValues,
    },
  })

  const onSubmit = (data: CarrierFormValues) => {
    createCarrier(
      {
        name: data.name,
        groupNumber: data.groupTitle,
        contactFirst: data.contactFirstName ?? '',
        contactLast: data.contactLastName ?? '',
        address1: data.address1 ?? '',
        address2: data.address2 ?? '',
        city: data.city ?? '',
        state: data.state ?? '',
        zip: data.zip ?? '',
        phone: data.phone ?? '',
        fax: data.fax ?? '',
        email: data.email ?? '',
        allowFlexibleDates: data.allowFlexibleDates ?? false,
      },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      },
    )
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="bg-sidebar px-6 py-4 border-b border-sidebar-border flex items-center justify-between">
        <h2 className="text-base font-bold tracking-wide text-sidebar-foreground uppercase">
          {title}
        </h2>
      </div>

      {/* Form body */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="px-6 py-6 sm:px-8 space-y-0"
        >
          {/* Name (required) */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  Name
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-name"
                      placeholder="Enter carrier name"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  Group Title
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-group-title"
                      placeholder="Enter group title"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Address 1 */}
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Address 1</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-address1"
                      placeholder="Enter address line 1"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Address 2</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-address2"
                      placeholder="Enter address line 2"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>City</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-city"
                      placeholder="Enter city"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>State</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={statesLoading}
                    >
                      <SelectTrigger
                        id="carrier-state"
                        className="h-9 w-full rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      >
                        <SelectValue
                          placeholder={
                            statesLoading ? 'Loading...' : 'Select state...'
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
                  {statesError && (
                    <p className="text-xs text-destructive font-medium">
                      Failed to load states. Please refresh.
                    </p>
                  )}
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Zip</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-zip"
                      placeholder="Enter ZIP code"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Contact First Name */}
          <FormField
            control={form.control}
            name="contactFirstName"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Contact First Name</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-contact-first-name"
                      placeholder="Enter contact first name"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Contact Last Name</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-contact-last-name"
                      placeholder="Enter contact last name"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Phone</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-phone"
                      type="tel"
                      placeholder="(___) ___-____"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Fax</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-fax"
                      type="tel"
                      placeholder="(___) ___-____"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className={LABEL_COL}>Email</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="carrier-email"
                      type="email"
                      placeholder="Enter email address"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-x-4 gap-y-1 py-3 border-b border-slate-100 last:border-0">
                <FormLabel className="sm:text-right text-left text-sm font-semibold text-slate-700">
                  Allow Flexible Dates
                </FormLabel>
                <div className="flex items-center h-9">
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

          {/* Validation error summary */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 mt-4">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-destructive" />
              <p className="text-xs text-destructive font-medium">
                Please fix the highlighted fields before saving.
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
            <Button
              id="carrier-back-btn"
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-md px-6 h-9 font-semibold shadow-xs transition-colors"
            >
              Back
            </Button>
            <Button
              id="carrier-save-btn"
              type="submit"
              disabled={isPending}
              className="bg-tan-dark hover:bg-tan-dark/90 text-white rounded-md px-6 h-9 font-semibold shadow-xs transition-colors disabled:opacity-70"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
