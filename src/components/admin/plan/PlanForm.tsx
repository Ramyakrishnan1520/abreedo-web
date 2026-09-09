import { useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'

import { Form } from '#/components/ui/Form'
import { GeneralStep } from '#/components/admin/plan/GeneralStep.tsx'
import { ReviewStep } from '#/components/admin/plan/ReviewStep.tsx'
import { Stepper } from '#/components/admin/common/Stepper'
import { FormNavigationActions } from '#/components/admin/common/FormNavigationActions.tsx'
import {
  PLAN_DEFAULT_VALUES,
  PLAN_STEPS,
} from '#/components/admin/plan/plan-steps.ts'
import {
  planSchema,
  type PlanFormSchemaValues,
} from '#/components/admin/plan/plan.schema.ts'
import { useCreatePlan } from '#/hooks/plan/useCreatePlan.ts'
import { useUpdatePlan } from '#/hooks/plan/useUpdatePlan.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { getPlanStepValidationFields } from '#/utils/getPlanStepValidationFields.ts'

import type { CreatePlanRequest } from '#/types/plan.ts'

const { form: formCopy } = PLAN_CONTENT

interface PlanFormProps {
  mode?: 'create' | 'edit'
  planId?: string
  defaultValues?: Partial<PlanFormSchemaValues>
  initialValues?: Partial<PlanFormSchemaValues>
  onBack?: () => void
  onSuccess?: () => void
  title?: string
}

const STEP_COMPONENTS = [GeneralStep, ReviewStep] as const

export function PlanForm({
  mode = 'create',
  planId,
  defaultValues,
  initialValues,
  onBack,
  onSuccess,
  title,
}: PlanFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: createPlan, isPending: isCreating } = useCreatePlan()
  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan()
  const isPending = isCreating || isUpdating

  const resolvedTitle =
    title ??
    (mode === 'edit'
      ? formCopy.titles.edit
      : formCopy.titles.create)

  const form = useForm<PlanFormSchemaValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      ...PLAN_DEFAULT_VALUES,
      ...defaultValues,
      ...initialValues,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === PLAN_STEPS.length - 1
  const StepComponent = STEP_COMPONENTS[currentStep]

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((step) => step - 1)
      return
    }
    if (onBack) {
      onBack()
    }
  }

  const handleNext = async () => {
    const fields = getPlanStepValidationFields(currentStep)
    const isValid = await form.trigger(fields)

    if (isValid) {
      setCurrentStep((step) => step + 1)
    }
  }

  const onSubmit = (data: PlanFormSchemaValues) => {
    const payload: CreatePlanRequest = {
      code: null,
      parentCompanyId: data.parentCompanyId || null,
      commissionCodeId: data.commissionCodeId || null,
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

    if (mode === 'edit' && planId) {
      updatePlan(
        { id: planId, data: payload },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
    } else {
      createPlan(payload, {
        onSuccess: () => {
          onSuccess?.()
        },
      })
    }
  }

  const handleSave = () => {
    void form.handleSubmit(onSubmit)()
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const saveLabel =
    mode === 'edit'
      ? formCopy.saveLabels.edit
      : formCopy.saveLabels.create

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Header with Kicker & Stepper */}
      <div className="border-b border-slate-200 bg-sidebar px-6 py-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-tan-accent">
              {formCopy.kicker}
            </p>
            <h1 className="display-title mt-1 text-2xl font-bold text-sidebar-foreground">
              {resolvedTitle}
            </h1>
          </div>
        </div>

        <Stepper
          steps={PLAN_STEPS}
          currentStep={currentStep}
          className="rounded-xl bg-white/5 px-2 py-4 sm:px-4"
        />
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form
          onSubmit={handleFormSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <StepComponent />

            {Object.keys(form.formState.errors).length > 0 &&
              form.formState.isSubmitted && (
                <div className="mt-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <p className="text-xs font-medium text-destructive">
                    {formCopy.validationSummary}
                  </p>
                </div>
              )}
          </div>

          {/* Sticky Bottom Navigation */}
          <FormNavigationActions
            idPrefix="plan"
            backLabel={formCopy.navigation.back}
            nextLabel={formCopy.navigation.next}
            saveLabel={saveLabel}
            isLastStep={isLastStep}
            isPending={isPending}
            onBack={handleBack}
            onNext={() => void handleNext()}
            onSave={handleSave}
          />
        </form>
      </Form>
    </div>
  )
}
