import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Input } from '#/components/ui/input.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
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

  const carrierOptions = useMemo(
    () => carriers.map((c) => ({ value: String(c.id), label: c.name })),
    [carriers],
  )

  const classOptions = useMemo(
    () =>
      coverageClasses.map((cc) => ({
        value: cc.coverageClassId,
        label: cc.name || cc.code || '',
      })),
    [coverageClasses],
  )

  const typeOptions = useMemo(
    () =>
      coverageTypes.map((ct) => ({
        value: ct.coverageTypeId,
        label: ct.name || ct.code || '',
      })),
    [coverageTypes],
  )

  return (
    <div className="space-y-6">
      {/* Code (required) */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
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
            <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
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
            <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
              {copy.carrierLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <ConfigurableSelect
                  id="coverage-carrier"
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={carrierOptions}
                  placeholder={copy.carrierSelectPlaceholder}
                  loading={carriersLoading}
                  loadingPlaceholder={copy.carrierLoadingPlaceholder}
                  open={carrierSelectOpen}
                  onOpenChange={setCarrierSelectOpen}
                  onContentRef={setCarrierSelectContent}
                  loadMoreRef={carrierLoadMoreRef}
                  isFetchingNextPage={carriersFetchingNextPage}
                  loadingMoreLabel={
                    COVERAGE_CODE_CONTENT.form.loadingMoreCarriers
                  }
                  triggerClassName={FORM_INPUT_CLASS}
                />
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
            <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
              {copy.coverageClassLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <ConfigurableSelect
                  id="coverage-class"
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={classOptions}
                  placeholder={
                    classesLoading
                      ? copy.coverageClassLoadingPlaceholder
                      : copy.coverageClassSelectPlaceholder
                  }
                  loading={classesLoading}
                  disabled={classesError}
                  triggerClassName={FORM_INPUT_CLASS}
                />
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

      {/* Remittance Type Dropdown (required) */}
      <FormField
        control={form.control}
        name="remittanceTypeId"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
              {copy.remittanceTypeLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <ConfigurableSelect
                  id="coverage-type"
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={typeOptions}
                  placeholder={
                    typesLoading
                      ? copy.remittanceTypeLoadingPlaceholder
                      : copy.remittanceTypeSelectPlaceholder
                  }
                  loading={typesLoading}
                  disabled={typesError}
                  triggerClassName={FORM_INPUT_CLASS}
                />
              </FormControl>
              {typesError ? (
                <p className="text-xs font-medium text-destructive">
                  {COVERAGE_CODE_CONTENT.form.remittanceTypesLoadError}
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
