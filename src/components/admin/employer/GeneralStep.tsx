import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
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
      parentCompanies.filter(
        (pc) => Boolean(pc.id && String(pc.id).trim() !== ''),
      ),
    [parentCompanies],
  )

  // Auto-select first parent company if not selected yet
  useEffect(() => {
    const currentId = form.getValues('parentCompanyId')
    if (!currentId && parentCompanyOptions.length > 0) {
      form.setValue('parentCompanyId', parentCompanyOptions[0].id, {
        shouldValidate: true,
      })
    }
  }, [form, parentCompanyOptions])

  const { data: states = [], isLoading: isLoadingStates, isError: isStatesError } =
    useGetStates()

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
              <Select
                value={field.value || ''}
                onValueChange={field.onChange}
                disabled={isLoadingParentCompanies}
                open={parentCompanySelectOpen}
                onOpenChange={setParentCompanySelectOpen}
              >
                <FormControl>
                  <SelectTrigger
                    id="employer-parent-company"
                    className={`${FORM_INPUT_CLASS} w-full justify-between`}
                  >
                    <SelectValue placeholder={copy.parentCompanySelectPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  ref={setParentCompanySelectContent}
                  position="popper"
                  className="max-h-60 bg-white"
                >
                  {parentCompanyOptions.map((pc) => (
                    <SelectItem key={pc.id} value={pc.id}>
                      {pc.name}
                    </SelectItem>
                  ))}
                  <div
                    ref={parentCompanyLoadMoreRef}
                    className="h-px"
                    aria-hidden
                  />
                  {isFetchingNextParentCompaniesPage ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
                      <Loader2 className="size-3.5 animate-spin" />
                      Loading more...
                    </div>
                  ) : null}
                </SelectContent>
              </Select>
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    disabled={isLoadingStates || isStatesError}
                  >
                    <FormControl>
                      <SelectTrigger
                        id="employer-state"
                        className={`${FORM_INPUT_CLASS} w-full justify-between`}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingStates
                              ? copy.stateLoadingPlaceholder
                              : copy.stateSelectPlaceholder
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 bg-white">
                      {states.map((stateItem) => (
                        <SelectItem key={stateItem.id} value={stateItem.id}>
                          {stateItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
