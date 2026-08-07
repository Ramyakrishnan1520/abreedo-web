import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'

import { ConfigurableSelect } from '#/components/admin/plan/ConfigurableSelect.tsx'
import {
  planSchema,
  type PlanFormSchemaValues,
} from '#/components/admin/plan/plan.schema.ts'
import { Button } from '#/components/ui/button.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/Form'
import { Input } from '#/components/ui/input.tsx'
import { useInfiniteCoverageCodeOptions } from '#/hooks/coverage-code/use-infinite-coverage-code-options.ts'
import { useAvailableParentCompanies } from '#/hooks/parent-company/useAvailableParentCompanies.ts'
import { useInfinitePlanOptions } from '#/hooks/plan/use-infinite-plan-options.ts'
import { useCreatePlan } from '#/hooks/plan/useCreatePlan.ts'
import { useGroupTypeOptions } from '#/hooks/plan/useGroupTypeOptions.ts'
import { useLoadMoreIntersection } from '#/hooks/use-load-more-intersection.ts'
import { cn } from '#/lib/utils.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { LABEL_COL } from '#/components/admin/common/form-styles.ts'
import type { CreatePlanRequest } from '#/types/plan.ts'

const copy = PLAN_CONTENT.form

interface PlanFormProps {
  defaultValues?: Partial<PlanFormSchemaValues>
  onBack?: () => void
  onSuccess?: () => void
  title?: string
}

export function PlanForm({
  defaultValues,
  onBack,
  onSuccess,
  title = PLAN_CONTENT.form.defaultTitle,
}: PlanFormProps) {
  const { mutate: createPlan, isPending } = useCreatePlan()

  // Parent Company infinite scroll setup
  const {
    parentCompanies,
    isLoading: parentCompaniesLoading,
    isError: parentCompaniesError,
    isFetchingNextPage: parentCompaniesFetchingNextPage,
    hasNextPage: parentCompaniesHasNextPage,
    fetchNextPage: fetchNextParentCompaniesPage,
  } = useAvailableParentCompanies()

  const [parentCompanySelectContent, setParentCompanySelectContent] =
    useState<HTMLDivElement | null>(null)
  const [parentCompanySelectOpen, setParentCompanySelectOpen] = useState(false)
  const parentCompanyLoadMoreRef = useLoadMoreIntersection({
    hasNextPage: parentCompaniesHasNextPage,
    isFetchingNextPage: parentCompaniesFetchingNextPage,
    fetchNextPage: fetchNextParentCompaniesPage,
    enabled: parentCompanySelectOpen,
    root: parentCompanySelectContent,
  })

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

  const form = useForm<PlanFormSchemaValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      parentCompanyId: '',
      coverageCodeId: '',
      option: '',
      name: '',
      effectiveDate: '',
      groupType: '',
      linkedPlanId: '',
      linkedPlan2Id: '',
      ...defaultValues,
    },
  })

  const selectedLinkedPlanId = form.watch('linkedPlanId')
  const selectedLinkedPlan2Id = form.watch('linkedPlan2Id')

  const parentCompanyOptions = useMemo(
    () =>
      parentCompanies.map((pc) => ({
        value: String(pc.id),
        label: pc.name,
      })),
    [parentCompanies],
  )

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

  const onSubmit = (data: PlanFormSchemaValues) => {
    const payload: CreatePlanRequest = {
      code: null,
      parentCompanyId: data.parentCompanyId || null,
      name: data.name,
      option: data.option,
      effectiveDate: data.effectiveDate
        ? new Date(data.effectiveDate).toISOString()
        : null,
      coverageCodeId: data.coverageCodeId || null,
      groupTypeId: data.groupType || null,
      linkedPlanId: data.linkedPlanId || null,
      linkedPlan2Id: data.linkedPlan2Id || null,
    }

    createPlan(payload, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  const hasFormErrors = Object.keys(form.formState.errors).length > 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-900">{title}</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Validation summary banner */}
          {hasFormErrors && (
            <div
              className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive"
              role="alert"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{copy.validationSummary}</span>
            </div>
          )}

          {/* Parent Company Dropdown */}
          <FormField
            control={form.control}
            name="parentCompanyId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:ml-0.5 after:text-destructive after:content-["*"]',
                  )}
                >
                  {copy.labels.parentCompany}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-parent-company"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={parentCompanyOptions}
                      loading={parentCompaniesLoading}
                      placeholder={copy.placeholders.parentCompanySelect}
                      loadingPlaceholder={
                        copy.placeholders.parentCompanyLoading
                      }
                      open={parentCompanySelectOpen}
                      onOpenChange={setParentCompanySelectOpen}
                      onContentRef={setParentCompanySelectContent}
                      loadMoreRef={parentCompanyLoadMoreRef}
                      isFetchingNextPage={parentCompaniesFetchingNextPage}
                      loadingMoreLabel={copy.loadingMore}
                      triggerClassName="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
                      contentClassName="max-h-60"
                    />
                  </FormControl>
                  {parentCompaniesError && (
                    <p className="text-xs font-medium text-destructive">
                      {copy.placeholders.parentCompanyLoading}
                    </p>
                  )}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Coverage Code Dropdown */}
          <FormField
            control={form.control}
            name="coverageCodeId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:ml-0.5 after:text-destructive after:content-["*"]',
                  )}
                >
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
                      triggerClassName="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
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

          {/* Option Input */}
          <FormField
            control={form.control}
            name="option"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:ml-0.5 after:text-destructive after:content-["*"]',
                  )}
                >
                  {copy.labels.option}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="plan-option"
                      placeholder={copy.placeholders.option}
                      className="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
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
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:ml-0.5 after:text-destructive after:content-["*"]',
                  )}
                >
                  {copy.labels.name}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="plan-name"
                      placeholder={copy.placeholders.name}
                      className="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Effective Date Picker using Shadcn Input (type="date") */}
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:ml-0.5 after:text-destructive after:content-["*"]',
                  )}
                >
                  {copy.labels.effectiveDate}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input
                      id="plan-effective-date"
                      type="date"
                      className="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white sm:w-64"
                      {...field}
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
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel
                  className={cn(
                    LABEL_COL,
                    'after:ml-0.5 after:text-destructive after:content-["*"]',
                  )}
                >
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
                      triggerClassName="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white sm:w-64"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Linked Plan Dropdown */}
          <FormField
            control={form.control}
            name="linkedPlanId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel className={LABEL_COL}>
                  {copy.labels.linkedPlan}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-linked-plan"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={linkedPlan1Options}
                      loading={plansLoading}
                      placeholder={copy.placeholders.linkedPlanSelect}
                      loadingPlaceholder={copy.placeholders.linkedPlanLoading}
                      open={linkedPlanSelectOpen}
                      onOpenChange={setLinkedPlanSelectOpen}
                      onContentRef={setLinkedPlanSelectContent}
                      loadMoreRef={linkedPlanLoadMoreRef}
                      isFetchingNextPage={plansFetchingNextPage}
                      loadingMoreLabel={copy.loadingMore}
                      triggerClassName="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
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
              <FormItem className="grid grid-cols-1 items-start gap-x-4 gap-y-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
                <FormLabel className={LABEL_COL}>
                  {copy.labels.linkedPlan2}
                </FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <ConfigurableSelect
                      id="plan-linked-plan-2"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={linkedPlan2Options}
                      loading={plansLoading}
                      placeholder={copy.placeholders.linkedPlanSelect}
                      loadingPlaceholder={copy.placeholders.linkedPlanLoading}
                      open={linkedPlan2SelectOpen}
                      onOpenChange={setLinkedPlan2SelectOpen}
                      onContentRef={setLinkedPlan2SelectContent}
                      loadMoreRef={linkedPlan2LoadMoreRef}
                      isFetchingNextPage={plansFetchingNextPage}
                      loadingMoreLabel={copy.loadingMore}
                      triggerClassName="h-9 rounded-md border-slate-200 bg-slate-50/50 text-slate-900 focus:border-tan-dark focus:bg-white"
                      contentClassName="max-h-60"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
            <Button
              id="plan-back-btn"
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isPending}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-md px-6 h-9 font-semibold shadow-xs transition-colors"
            >
              {copy.actions.back}
            </Button>
            <Button
              id="plan-save-btn"
              type="submit"
              disabled={isPending}
              className="bg-tan-dark hover:bg-tan-dark/90 text-white rounded-md px-6 h-9 font-semibold shadow-xs transition-colors disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                copy.actions.save
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
