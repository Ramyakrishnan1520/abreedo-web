import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'

import { Form } from '#/components/ui/Form'
import { GeneralStep } from '#/components/admin/employer/GeneralStep.tsx'
import { ContactStep } from '#/components/admin/employer/ContactStep.tsx'
import { ConfigurationStep } from '#/components/admin/employer/ConfigurationStep.tsx'
import { CarriersStep } from '#/components/admin/employer/CarriersStep.tsx'
import { NotesStep } from '#/components/admin/employer/NotesStep.tsx'
import { PlanStep } from '#/components/admin/employer/PlanStep.tsx'
import { RateStep } from '#/components/admin/employer/RateStep.tsx'
import { ReviewStep } from '#/components/admin/employer/ReviewStep.tsx'
import { Stepper } from '#/components/admin/common/Stepper'
import { FormNavigationActions } from '#/components/admin/common/FormNavigationActions.tsx'
import { cn } from '#/lib/utils.ts'
import {
  EMPLOYER_DEFAULT_VALUES,
  EMPLOYER_GENERAL_STEPS,
  EMPLOYER_PLAN_STEPS,
  EMPLOYER_STEPS,
} from '#/components/admin/employer/employer-steps.ts'
import {
  employerAddPlanSchema,
  employerCreateSchema,
  employerGeneralEditSchema,
  employerPlanEditSchema,
  type EmployerFormValues,
  type ConfiguredEmployerPlan,
} from '#/components/admin/employer/employer.schema.ts'
import { useCreateEmployer } from '#/hooks/employer/useCreateEmployer.ts'
import { useCreateEmployerPlan } from '#/hooks/employer/useCreateEmployerPlan.ts'
import { useUpdateEmployer } from '#/hooks/employer/useUpdateEmployer.ts'
import { useUpdateEmployerPlan } from '#/hooks/employer/useUpdateEmployerPlan.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import {
  mapFormToAddPlansPayload,
  mapFormToCreateEmployerPayload,
  mapFormToGeneralUpsertPayload,
  mapFormToPlanUpdatePayload,
} from '#/utils/mapEmployerFormToPayloads.ts'
import {
  getEmployerStepValidationFields,
  type EmployerFormMode,
} from '#/utils/getEmployerStepValidationFields.ts'

const { form: formCopy } = EMPLOYER_CONTENT

export type { EmployerFormMode }

interface EmployerFormProps {
  mode?: EmployerFormMode | 'edit'
  employerId?: string
  defaultValues?: Partial<EmployerFormValues>
  initialValues?: Partial<EmployerFormValues>
  onBack?: () => void
  onSuccess?: () => void
  onSavePlans?: (plans: ConfiguredEmployerPlan[]) => void
  title?: string
  className?: string
}

const CREATE_STEP_COMPONENTS = [
  GeneralStep,
  ContactStep,
  ConfigurationStep,
  CarriersStep,
  NotesStep,
  PlanStep,
  ReviewStep,
] as const

const GENERAL_EDIT_STEP_COMPONENTS = [
  GeneralStep,
  ContactStep,
  ConfigurationStep,
  CarriersStep,
  NotesStep,
  ReviewStep,
] as const

const PLAN_EDIT_STEP_COMPONENTS = [
  PlanStep,
  RateStep,
  ReviewStep,
] as const

export function EmployerForm({
  mode = 'create',
  employerId,
  defaultValues,
  initialValues,
  onBack,
  onSuccess,
  onSavePlans,
  title,
  className,
}: EmployerFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: createEmployer, isPending: isCreating } = useCreateEmployer()
  const { mutate: createEmployerPlan, isPending: isCreatingPlan } =
    useCreateEmployerPlan()
  const { mutate: updateEmployer, isPending: isUpdatingGeneral } =
    useUpdateEmployer()
  const { mutate: updateEmployerPlan, isPending: isUpdatingPlan } =
    useUpdateEmployerPlan()
  const isPending =
    isCreating || isCreatingPlan || isUpdatingGeneral || isUpdatingPlan

  const normalizedMode: EmployerFormMode =
    mode === 'edit' ? 'edit-general' : mode
  const isEditMode =
    normalizedMode === 'edit-general' || normalizedMode === 'edit-plan'

  const steps = useMemo(() => {
    switch (normalizedMode) {
      case 'edit-general':
        return EMPLOYER_GENERAL_STEPS
      case 'edit-plan':
      case 'add-plan':
        return EMPLOYER_PLAN_STEPS
      default:
        return EMPLOYER_STEPS
    }
  }, [normalizedMode])

  const stepComponents = useMemo(() => {
    switch (normalizedMode) {
      case 'edit-general':
        return GENERAL_EDIT_STEP_COMPONENTS
      case 'edit-plan':
      case 'add-plan':
        return PLAN_EDIT_STEP_COMPONENTS
      default:
        return CREATE_STEP_COMPONENTS
    }
  }, [normalizedMode])

  const schema = useMemo(() => {
    if (normalizedMode === 'edit-general') return employerGeneralEditSchema
    if (normalizedMode === 'edit-plan') return employerPlanEditSchema
    if (normalizedMode === 'add-plan') return employerAddPlanSchema
    return employerCreateSchema
  }, [normalizedMode])

  const form = useForm<EmployerFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<EmployerFormValues>,
    defaultValues: {
      ...EMPLOYER_DEFAULT_VALUES,
      ...defaultValues,
      ...initialValues,
    },
    mode: 'onTouched',
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...EMPLOYER_DEFAULT_VALUES,
        ...defaultValues,
        ...initialValues,
      })
    }
  }, [initialValues, defaultValues, form])

  const resolvedTitle = useMemo(() => {
    if (title) return title
    switch (normalizedMode) {
      case 'edit-general':
        return formCopy.titles.editGeneral
      case 'edit-plan':
        return formCopy.titles.editPlan
      case 'add-plan':
        return formCopy.titles.addPlan
      default:
        return formCopy.titles.create
    }
  }, [title, normalizedMode])

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const StepComponent = stepComponents[currentStep]

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
    // Step validation for Plan Step in Create mode (index 5)
    if (normalizedMode === 'create' && currentStep === 5) {
      const plans = form.getValues('plans') ?? []
      if (plans.length === 0) {
        form.setError('plans', {
          message: EMPLOYER_CONTENT.validation.planRequiresAtLeastOne,
        })
        return
      }
      const missingRates = plans.some((p) => !p.rates || p.rates.length === 0)
      if (missingRates) {
        form.setError('plans', {
          message: EMPLOYER_CONTENT.validation.rateRequiresAtLeastOne,
        })
        return
      }
      form.clearErrors('plans')
      setCurrentStep((step) => step + 1)
      return
    }

    // Step validation for Plan Step in Add-Plan mode (index 0)
    if (normalizedMode === 'add-plan' && currentStep === 0) {
      const plans = form.getValues('plans') ?? []
      if (plans.length === 0) {
        form.setError('plans', {
          message: EMPLOYER_CONTENT.validation.planRequiresAtLeastOne,
        })
        return
      }
      form.clearErrors('plans')
      setCurrentStep((step) => step + 1)
      return
    }

    // Step validation for Rate Step in Add-Plan mode (index 1)
    if (normalizedMode === 'add-plan' && currentStep === 1) {
      const plans = form.getValues('plans') ?? []
      if (plans.length === 0) {
        form.setError('plans', {
          message: EMPLOYER_CONTENT.validation.planRequiresAtLeastOne,
        })
        return
      }
      const missingRates = plans.some((p) => !p.rates || p.rates.length === 0)
      if (missingRates) {
        form.setError('plans', {
          message: EMPLOYER_CONTENT.validation.rateRequiresAtLeastOne,
        })
        return
      }
      form.clearErrors('plans')
      setCurrentStep((step) => step + 1)
      return
    }

    const fields = getEmployerStepValidationFields(currentStep, normalizedMode)
    const isValid = await form.trigger(fields)

    if (!isValid) {
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const onSubmit = (data: EmployerFormValues) => {
    if (normalizedMode === 'add-plan') {
      if (onSavePlans) {
        onSavePlans(data.plans ?? [])
        onSuccess?.()
        return
      }
      if (employerId) {
        const createPlansPayload = mapFormToAddPlansPayload(data)
        createEmployerPlan(
          { id: employerId, data: createPlansPayload },
          {
            onSuccess: () => {
              onSuccess?.()
            },
          },
        )
        return
      }
    }

    if (normalizedMode === 'edit-plan') {
      if (onSavePlans) {
        onSavePlans(data.plans ?? [])
        onSuccess?.()
        return
      }
      if (employerId) {
        const planPayload = mapFormToPlanUpdatePayload(data)
        updateEmployerPlan(
          { id: employerId, data: planPayload },
          {
            onSuccess: () => {
              onSuccess?.()
            },
          },
        )
        return
      }
    }

    if (normalizedMode === 'edit-general' && employerId) {
      const generalPayload = mapFormToGeneralUpsertPayload(data)
      updateEmployer(
        { id: employerId, data: generalPayload },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
      return
    }

    const createPayload = mapFormToCreateEmployerPayload(data)
    createEmployer(createPayload, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  const handleSave = () => {
    void form.handleSubmit(onSubmit)()
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const saveLabel = isEditMode
    ? formCopy.saveLabels.edit
    : formCopy.saveLabels.create

  return (
    <div
      className={cn(
        'flex min-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs',
        className,
      )}
    >
      {/* Header with Kicker & Stepper */}
      <div className="border-b border-slate-200 bg-sidebar px-6 py-5 pr-12 sm:pr-14">
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
          steps={steps}
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
            {isLastStep ? (
              <ReviewStep mode={normalizedMode} />
            ) : (
              <StepComponent mode={normalizedMode} />
            )}

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
            idPrefix="employer"
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
