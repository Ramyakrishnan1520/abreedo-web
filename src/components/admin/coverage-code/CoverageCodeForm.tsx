import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'

import {
  coverageCodeSchema,
  type CoverageCodeFormValues,
} from '#/components/admin/coverage-code/coverage-code.schema.ts'
import { useCreateCoverageCode } from '#/hooks/coverage-code/useCreateCoverageCode.ts'
import { useGetCoverageClasses } from '#/hooks/coverage-code/useGetCoverageClasses.ts'
import { useGetCoverageTypes } from '#/hooks/coverage-code/useGetCoverageTypes.ts'
import { useInfiniteCarrierOptions } from '#/hooks/carrier/use-infinite-carrier-options.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'

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

const copy = COVERAGE_CODE_CONTENT.form

interface CoverageCodeFormProps {
  defaultValues?: Partial<CoverageCodeFormValues>
  onBack?: () => void
  onSuccess?: () => void
  title?: string
}

const LABEL_COL =
  'sm:text-right text-left text-sm font-semibold text-slate-700 sm:pt-2 pt-0'

export function CoverageCodeForm({
  defaultValues,
  onBack,
  onSuccess,
  title = COVERAGE_CODE_CONTENT.form.defaultTitle,
}: CoverageCodeFormProps) {
  const { mutate: createCoverageCode, isPending } = useCreateCoverageCode()
  const {
    carriers,
    // totalCount,
    isLoading: carriersLoading,
    isError: carriersError,
    isFetchingNextPage: carriersFetchingNextPage,
    hasNextPage: carriersHasNextPage,
    fetchNextPage: fetchNextCarriersPage,
  } = useInfiniteCarrierOptions()
  const {
    data: coverageClasses = [],
    isLoading: classesLoading,
    isError: classesError,
  } = useGetCoverageClasses()
  const {
    data: coverageTypes = [],
    isLoading: typesLoading,
    isError: typesError,
  } = useGetCoverageTypes()

  const [carrierSelectContent, setCarrierSelectContent] =
    useState<HTMLDivElement | null>(null)
  const [carrierSelectOpen, setCarrierSelectOpen] = useState(false)
  const carrierLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: carriersHasNextPage,
    isFetchingNextPage: carriersFetchingNextPage,
    fetchNextPage: fetchNextCarriersPage,
    enabled: carrierSelectOpen,
    root: carrierSelectContent,
  })

  const form = useForm<CoverageCodeFormValues>({
    resolver: zodResolver(coverageCodeSchema),
    defaultValues: {
      code: '',
      name: '',
      carrierId: '',
      coverageClassId: '',
      codeInvoice: '',
      invoiceInclude: false,
      codeReport: '',
      title: '',
      shortTitle: '',
      remittanceTypeId: '',
      invoiceGroup: '',
      ...defaultValues,
    },
  })

  const onSubmit = (data: CoverageCodeFormValues) => {
    createCoverageCode(
      {
        code: data.code,
        matrixName: data.name,
        carrierId: data.carrierId,
        coverageClassId: data.coverageClassId,
        codeInvoice: data.codeInvoice,
        invoiceInclude: data.invoiceInclude,
        codeReport: data.codeReport,
        title: data.title,
        shortTitle: data.shortTitle,
        remittanceTypeId: data.remittanceTypeId,
        invoiceGroup: data.invoiceGroup,
        linkedCode: '',
        orderNumber: 0,
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
        {/* <span className="text-xs font-semibold text-tan-accent uppercase tracking-wider">
          Form
        </span> */}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="px-6 py-6 sm:px-8 space-y-0"
        >
          {/* Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  {copy.labels.code}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="coverage-code"
                      placeholder={copy.placeholders.code}
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Name */}
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
                  {copy.labels.name}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="coverage-name"
                      placeholder={copy.placeholders.name}
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Carrier Dropdown */}
          <FormField
            control={form.control}
            name="carrierId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  {copy.labels.carrier}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={carriersLoading}
                      open={carrierSelectOpen}
                      onOpenChange={setCarrierSelectOpen}
                    >
                      <SelectTrigger
                        id="coverage-carrier"
                        className="h-9 w-full rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      >
                        <SelectValue
                          placeholder={
                            carriersLoading
                              ? copy.placeholders.carrierLoading
                              : copy.placeholders.carrierSelect
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        ref={setCarrierSelectContent}
                        position="popper"
                        className="max-h-60"
                      >
                        {carriers.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                        <div
                          ref={carrierLoadMoreRef}
                          className="h-px"
                          aria-hidden
                        />
                        {carriersFetchingNextPage ? (
                          <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
                            <Loader2 className="size-3.5 animate-spin" />
                            {copy.loadingMoreCarriers}
                          </div>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {carriersError && (
                    <p className="text-xs text-destructive font-medium">
                      {copy.carriersLoadError}
                    </p>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Coverage Class Dropdown */}
          <FormField
            control={form.control}
            name="coverageClassId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  {copy.labels.coverageClass}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={classesLoading}
                    >
                      <SelectTrigger
                        id="coverage-class"
                        className="h-9 w-full rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      >
                        <SelectValue
                          placeholder={
                            classesLoading
                              ? copy.placeholders.coverageClassLoading
                              : copy.placeholders.coverageClassSelect
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {coverageClasses.map((cc) => (
                          <SelectItem
                            key={cc.coverageClassId}
                            value={cc.coverageClassId}
                          >
                            {cc.name || cc.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {classesError && (
                    <p className="text-xs text-destructive font-medium">
                      {copy.coverageClassesLoadError}
                    </p>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Combination for Bill */}
          <FormField
            control={form.control}
            name="codeInvoice"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  {copy.labels.combinationForBill}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="coverage-code-invoice"
                      placeholder={copy.placeholders.combinationForBill}
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel className="sm:text-right text-left text-sm font-semibold text-slate-700">
                  {copy.labels.useForBill}
                </FormLabel>
                <div className="flex items-center h-9">
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

          {/* Combination for Reports */}
          <FormField
            control={form.control}
            name="codeReport"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'whitespace-nowrap after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  {copy.labels.combinationForReports}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="coverage-code-report"
                      placeholder={copy.placeholders.combinationForReports}
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  {copy.labels.description}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="coverage-description"
                      placeholder={copy.placeholders.description}
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Short description */}
          <FormField
            control={form.control}
            name="shortTitle"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  {copy.labels.shortDescription}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="coverage-short-description"
                      placeholder={copy.placeholders.shortDescription}
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Coverage Type Dropdown */}
          <FormField
            control={form.control}
            name="remittanceTypeId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  Coverage Type
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={typesLoading}
                    >
                      <SelectTrigger
                        id="coverage-type"
                        className="h-9 w-full rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      >
                        <SelectValue
                          placeholder={
                            typesLoading
                              ? 'Loading...'
                              : 'Select a remittance type...'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {coverageTypes.map((ct) => (
                          <SelectItem
                            key={ct.coverageTypeId}
                            value={ct.coverageTypeId}
                          >
                            {ct.name || ct.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {typesError && (
                    <p className="text-xs text-destructive font-medium">
                      Failed to load coverage types. Please refresh.
                    </p>
                  )}
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
              <FormItem className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-x-4 gap-y-1 py-3 border-b border-slate-100 last:border-0">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:content-["*"] after:ml-0.5 after:text-destructive',
                  )}
                >
                  Invoice Group
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="coverage-invoice-group"
                      placeholder="Enter invoice group"
                      className="h-9 rounded-md bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-tan-dark"
                      {...field}
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
                {copy.validationSummary}
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
            <Button
              id="coverage-back-btn"
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-md px-6 h-9 font-semibold shadow-xs transition-colors"
            >
              {copy.actions.back}
            </Button>
            <Button
              id="coverage-save-btn"
              type="submit"
              disabled={isPending}
              className="bg-tan-dark hover:bg-tan-dark/90 text-white rounded-md px-6 h-9 font-semibold shadow-xs transition-colors disabled:opacity-70"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : copy.actions.save}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
