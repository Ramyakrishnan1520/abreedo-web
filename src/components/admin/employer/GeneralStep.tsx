import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Input } from '#/components/ui/input.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { useAvailableParentCompanies } from '#/hooks/parent-company/useAvailableParentCompanies.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

import type { EmployerFormValues } from '#/components/admin/employer/employer.schema.ts'

const copy = EMPLOYER_CONTENT.generalStep

export function GeneralStep() {
  const form = useFormContext<EmployerFormValues>()
  const {
    parentCompanies = [],
    isLoading: isLoadingParentCompanies,
    isFetchingNextPage: isFetchingNextParentCompaniesPage,
    hasNextPage: hasNextParentCompaniesPage,
    fetchNextPage: fetchNextParentCompaniesPage,
  } = useAvailableParentCompanies()

  const [parentCompanySelectContent, setParentCompanySelectContent] =
    useState<HTMLDivElement | null>(null)
  const [parentCompanySelectOpen, setParentCompanySelectOpen] = useState(false)

  const parentCompanyLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: hasNextParentCompaniesPage,
    isFetchingNextPage: isFetchingNextParentCompaniesPage,
    fetchNextPage: fetchNextParentCompaniesPage,
    enabled: parentCompanySelectOpen,
    root: parentCompanySelectContent,
  })

  const parentCompanyOptions = useMemo(
    () =>
      parentCompanies
        .filter((pc) => Boolean(pc.id && String(pc.id).trim() !== ''))
        .map((pc) => ({ value: pc.id, label: pc.name })),
    [parentCompanies],
  )

  // Auto-select first parent company if not selected yet
  useEffect(() => {
    const currentId = form.getValues('parentCompanyId')
    if (!currentId && parentCompanyOptions.length > 0) {
      form.setValue('parentCompanyId', parentCompanyOptions[0].value, {
        shouldValidate: true,
      })
    }
  }, [form, parentCompanyOptions])

  const { data: states = [], isLoading: isLoadingStates, isError: isStatesError } =
    useGetStates()

  const stateOptions = useMemo(
    () => states.map((s) => ({ value: s.name, label: s.name })),
    [states],
  )

  return (
    <div className="space-y-6">
      {/* Employer Name */}
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
                  id="employer-name"
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

      {/* Parent Company Name */}
      <FormField
        control={form.control}
        name="parentCompanyId"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
            <FormLabel className={REQUIRED_LABEL_CLASS}>
              {copy.parentCompanyLabel}
            </FormLabel>
            <div className="space-y-1">
              <FormControl>
                <ConfigurableSelect
                  id="employer-parent-company"
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={parentCompanyOptions}
                  placeholder={copy.parentCompanySelectPlaceholder}
                  loading={isLoadingParentCompanies}
                  loadingPlaceholder={copy.parentCompanyLoadingPlaceholder}
                  open={parentCompanySelectOpen}
                  onOpenChange={setParentCompanySelectOpen}
                  onContentRef={setParentCompanySelectContent}
                  loadMoreRef={parentCompanyLoadMoreRef}
                  isFetchingNextPage={isFetchingNextParentCompaniesPage}
                  triggerClassName={FORM_INPUT_CLASS}
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
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.address1Label}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="employer-address1"
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
                      id="employer-address2"
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
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.cityLabel}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="employer-city"
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
                <FormLabel className={LABEL_COL}>
                  {copy.stateLabel}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="employer-state"
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      options={stateOptions}
                      placeholder={
                        isLoadingStates
                          ? copy.stateLoadingPlaceholder
                          : copy.stateSelectPlaceholder
                      }
                      loading={isLoadingStates}
                      disabled={isStatesError}
                      triggerClassName={FORM_INPUT_CLASS}
                    />
                  </FormControl>
                  {isStatesError ? (
                    <p className="text-xs text-destructive">{copy.stateLoadError}</p>
                  ) : null}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* ZIP Code */}
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={REQUIRED_LABEL_CLASS}>
                  {copy.zipCodeLabel}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="employer-zip"
                      placeholder={copy.zipCodePlaceholder}
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
    </div>
  )
}
