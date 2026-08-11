import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import { Input } from '#/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { useGetCoverageClasses } from '#/hooks/coverage-code/useGetCoverageClasses.ts'
import { useGetCoverageTypes } from '#/hooks/coverage-code/useGetCoverageTypes.ts'
import { useInfiniteCarrierOptions } from '#/hooks/carrier/use-infinite-carrier-options.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { cn } from '#/lib/utils.ts'
import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'

export function GeneralStep() {
  const form = useFormContext<CoverageCodeFormValues>()
  const copy = COVERAGE_CODE_CONTENT.generalStep

  const {
    carriers,
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

  return (
    <div className="space-y-6">
      {/* Code (required) */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.codeLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="coverage-code"
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

      {/* Name (required) */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.nameLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  id="coverage-name"
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

      {/* Carrier Dropdown (required) */}
      <FormField
        control={form.control}
        name="carrierId"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.carrierLabel}
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
                    className="h-9 w-full rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
                  >
                    <SelectValue
                      placeholder={
                        carriersLoading
                          ? copy.carrierLoadingPlaceholder
                          : copy.carrierSelectPlaceholder
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
                        {COVERAGE_CODE_CONTENT.form.loadingMoreCarriers}
                      </div>
                    ) : null}
                  </SelectContent>
                </Select>
              </FormControl>
              {carriersError ? (
                <p className="text-xs font-medium text-destructive">
                  {COVERAGE_CODE_CONTENT.form.carriersLoadError}
                </p>
              ) : null}
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Coverage Class Dropdown (required) */}
      <FormField
        control={form.control}
        name="coverageClassId"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.coverageClassLabel}
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
                    className="h-9 w-full rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
                  >
                    <SelectValue
                      placeholder={
                        classesLoading
                          ? copy.coverageClassLoadingPlaceholder
                          : copy.coverageClassSelectPlaceholder
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
              {classesError ? (
                <p className="text-xs font-medium text-destructive">
                  {COVERAGE_CODE_CONTENT.form.coverageClassesLoadError}
                </p>
              ) : null}
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Coverage Type Dropdown (required) */}
      <FormField
        control={form.control}
        name="remittanceTypeId"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel
              className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}
            >
              {copy.coverageTypeLabel}
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
                    className="h-9 w-full rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
                  >
                    <SelectValue
                      placeholder={
                        typesLoading
                          ? copy.coverageTypeLoadingPlaceholder
                          : copy.coverageTypeSelectPlaceholder
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
              {typesError ? (
                <p className="text-xs font-medium text-destructive">
                  {COVERAGE_CODE_CONTENT.form.coverageTypesLoadError}
                </p>
              ) : null}
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
