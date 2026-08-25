import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { ConfigurableSelect } from '#/components/admin/common/ConfigurableSelect.tsx'
import { DatePicker } from '#/components/admin/common/DatePicker.tsx'
import {
  FORM_INPUT_CLASS,
  LABEL_COL,
  REQUIRED_LABEL_CLASS,
} from '#/components/admin/common/form-styles.ts'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Input } from '#/components/ui/input.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { useInfiniteCoverageCodeOptions } from '#/hooks/coverage-code/use-infinite-coverage-code-options.ts'
import { useCommissionCodeOptions } from '#/hooks/commisssion-code/useCommissionCodeOptions'
import { useInfinitePlanOptions } from '#/hooks/plan/use-infinite-plan-options.ts'
import { useGroupTypeOptions } from '#/hooks/plan/useGroupTypeOptions.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { cn } from '#/lib/utils.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

import type { PlanFormSchemaValues } from '#/components/admin/plan/plan.schema.ts'

const copy = PLAN_CONTENT.generalStep

export function GeneralStep() {
  const form = useFormContext<PlanFormSchemaValues>()

  // Coverage Code infinite scroll setup
  const {
    coverageCodes,
    isLoading: coverageCodesLoading,
    isError: coverageCodesError,
    isFetchingNextPage: coverageCodesFetchingNextPage,
    hasNextPage: coverageCodesHasNextPage,
    fetchNextPage: fetchNextCoverageCodesPage,
  } = useInfiniteCoverageCodeOptions()

  const [coverageCodeSelectContent, setCoverageCodeSelectContent] =
    useState<HTMLDivElement | null>(null)
  const [coverageCodeSelectOpen, setCoverageCodeSelectOpen] = useState(false)
  const coverageCodeLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: coverageCodesHasNextPage,
    isFetchingNextPage: coverageCodesFetchingNextPage,
    fetchNextPage: fetchNextCoverageCodesPage,
    enabled: coverageCodeSelectOpen,
    root: coverageCodeSelectContent,
  })

  // Commission Code options setup
  const {
    options: commissionCodeOptions,
    isLoading: commissionCodesLoading,
    isError: commissionCodesError,
  } = useCommissionCodeOptions()

  // Group Type options setup
  const { options: groupTypeOptions, isLoading: groupTypeLoading } =
    useGroupTypeOptions()

  // Linked Plans infinite scroll setup
  const {
    plans,
    isLoading: plansLoading,
    isError: plansError,
    isFetchingNextPage: plansFetchingNextPage,
    hasNextPage: plansHasNextPage,
    fetchNextPage: fetchNextPlansPage,
  } = useInfinitePlanOptions()

  const [linkedPlanSelectContent, setLinkedPlanSelectContent] =
    useState<HTMLDivElement | null>(null)
  const [linkedPlanSelectOpen, setLinkedPlanSelectOpen] = useState(false)
  const linkedPlanLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: plansHasNextPage,
    isFetchingNextPage: plansFetchingNextPage,
    fetchNextPage: fetchNextPlansPage,
    enabled: linkedPlanSelectOpen,
    root: linkedPlanSelectContent,
  })

  const [linkedPlan2SelectContent, setLinkedPlan2SelectContent] =
    useState<HTMLDivElement | null>(null)
  const [linkedPlan2SelectOpen, setLinkedPlan2SelectOpen] = useState(false)
  const linkedPlan2LoadMoreRef = useLoadMoreIntersection({
    hasNextPage: plansHasNextPage,
    isFetchingNextPage: plansFetchingNextPage,
    fetchNextPage: fetchNextPlansPage,
    enabled: linkedPlan2SelectOpen,
    root: linkedPlan2SelectContent,
  })

  const selectedLinkedPlanId = form.watch('linkedPlanId')
  const selectedLinkedPlan2Id = form.watch('linkedPlan2Id')

  const coverageCodeOptions = useMemo(
    () =>
      coverageCodes.map((c) => ({
        value: String(c.id),
        label: c.description || c.code,
      })),
    [coverageCodes],
  )

  const linkedPlan1Options = useMemo(
    () =>
      plans
        .filter((p) => String(p.id) !== selectedLinkedPlan2Id)
        .map((p) => ({
          value: String(p.id),
          label: p.name,
        })),
    [plans, selectedLinkedPlan2Id],
  )

  const linkedPlan2Options = useMemo(
    () =>
      plans
        .filter((p) => String(p.id) !== selectedLinkedPlanId)
        .map((p) => ({
          value: String(p.id),
          label: p.name,
        })),
    [plans, selectedLinkedPlanId],
  )

  return (
    <div className="space-y-6">
      {/* Section 1: Main Plan Information */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {copy.heading}
          </h3>
          <p className="text-xs text-slate-500">{copy.description}</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
          {/* Coverage Code Dropdown */}
          <FormField
            control={form.control}
            name="coverageCodeId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
                  {copy.labels.coverageCode}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-coverage-code"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={coverageCodeOptions}
                      loading={coverageCodesLoading}
                      placeholder={copy.placeholders.coverageCodeSelect}
                      loadingPlaceholder={
                        copy.placeholders.coverageCodeLoading
                      }
                      open={coverageCodeSelectOpen}
                      onOpenChange={setCoverageCodeSelectOpen}
                      onContentRef={setCoverageCodeSelectContent}
                      loadMoreRef={coverageCodeLoadMoreRef}
                      isFetchingNextPage={coverageCodesFetchingNextPage}
                      loadingMoreLabel={copy.loadingMore}
                      triggerClassName={FORM_INPUT_CLASS}
                      contentClassName="max-h-60"
                    />
                  </FormControl>
                  {coverageCodesError && (
                    <p className="text-xs font-medium text-destructive">
                      {copy.placeholders.coverageCodeLoading}
                    </p>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Commission Code Dropdown */}
          <FormField
            control={form.control}
            name="commissionCodeId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>
                  {copy.labels.commissionCode}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-commission-code"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={commissionCodeOptions}
                      loading={commissionCodesLoading}
                      placeholder={copy.placeholders.commissionCodeSelect}
                      loadingPlaceholder={
                        copy.placeholders.commissionCodeLoading
                      }
                      triggerClassName={FORM_INPUT_CLASS}
                      contentClassName="max-h-60"
                    />
                  </FormControl>
                  {commissionCodesError && (
                    <p className="text-xs font-medium text-destructive">
                      {copy.placeholders.commissionCodeLoading}
                    </p>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Option Input */}
          <FormField
            control={form.control}
            name="option"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
                  {copy.labels.option}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="plan-option"
                      placeholder={copy.placeholders.option}
                      className={FORM_INPUT_CLASS}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
                  {copy.labels.name}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="plan-name"
                      placeholder={copy.placeholders.name}
                      className={FORM_INPUT_CLASS}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Effective Date Picker */}
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
                  {copy.labels.effectiveDate}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <DatePicker
                      id="plan-effective-date"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={copy.placeholders.effectiveDate}
                      aria-label={copy.labels.effectiveDate}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Group Type Dropdown */}
          <FormField
            control={form.control}
            name="groupType"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={cn(LABEL_COL, REQUIRED_LABEL_CLASS)}>
                  {copy.labels.groupType}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-group-type"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={groupTypeOptions}
                      loading={groupTypeLoading}
                      placeholder={copy.placeholders.groupTypeSelect}
                      triggerClassName={FORM_INPUT_CLASS}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Section 2: Linked Plans */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {copy.linkedHeading}
          </h3>
          <p className="text-xs text-slate-500">{copy.linkedDescription}</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
          {/* Linked Plan Dropdown */}
          <FormField
            control={form.control}
            name="linkedPlanId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>
                  {copy.labels.linkedPlan}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-linked-plan"
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      options={linkedPlan1Options}
                      loading={plansLoading}
                      placeholder={copy.placeholders.linkedPlanSelect}
                      loadingPlaceholder={
                        copy.placeholders.linkedPlanLoading
                      }
                      open={linkedPlanSelectOpen}
                      onOpenChange={setLinkedPlanSelectOpen}
                      onContentRef={setLinkedPlanSelectContent}
                      loadMoreRef={linkedPlanLoadMoreRef}
                      isFetchingNextPage={plansFetchingNextPage}
                      loadingMoreLabel={copy.loadingMore}
                      triggerClassName={FORM_INPUT_CLASS}
                      contentClassName="max-h-60"
                    />
                  </FormControl>
                  {plansError && (
                    <p className="text-xs font-medium text-destructive">
                      {copy.placeholders.linkedPlanLoading}
                    </p>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Linked Plan 2 Dropdown */}
          <FormField
            control={form.control}
            name="linkedPlan2Id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 gap-2 sm:grid-cols-[220px_1fr] sm:items-start sm:gap-4">
                <FormLabel className={LABEL_COL}>
                  {copy.labels.linkedPlan2}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-linked-plan-2"
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      options={linkedPlan2Options}
                      loading={plansLoading}
                      placeholder={copy.placeholders.linkedPlanSelect}
                      loadingPlaceholder={
                        copy.placeholders.linkedPlanLoading
                      }
                      open={linkedPlan2SelectOpen}
                      onOpenChange={setLinkedPlan2SelectOpen}
                      onContentRef={setLinkedPlan2SelectContent}
                      loadMoreRef={linkedPlan2LoadMoreRef}
                      isFetchingNextPage={plansFetchingNextPage}
                      loadingMoreLabel={copy.loadingMore}
                      triggerClassName={FORM_INPUT_CLASS}
                      contentClassName="max-h-60"
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
