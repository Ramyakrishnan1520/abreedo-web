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
import {
  EMPLOYER_DEFAULT_VALUES,
  EMPLOYER_GENERAL_STEPS,
  EMPLOYER_PLAN_STEPS,
  EMPLOYER_STEPS,
} from '#/components/admin/employer/employer-steps.ts'
import {
  employerGeneralEditSchema,
  employerPlanEditSchema,
  employerSchema,
  type EmployerFormValues,
} from '#/components/admin/employer/employer.schema.ts'
import { useCreateEmployer } from '#/hooks/employer/useCreateEmployer.ts'
import { useUpdateEmployer } from '#/hooks/employer/useUpdateEmployer.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import {
  getEmployerStepValidationFields,
  type EmployerFormMode,
} from '#/utils/getEmployerStepValidationFields.ts'

import type { EmployerUpsertRequest } from '#/types/employer.ts'

const { form: formCopy } = EMPLOYER_CONTENT

export type { EmployerFormMode }

interface EmployerFormProps {
  mode?: EmployerFormMode | 'edit'
  employerId?: string
  defaultValues?: Partial<EmployerFormValues>
  initialValues?: Partial<EmployerFormValues>
  onBack?: () => void
  onSuccess?: () => void
  title?: string
}

const CREATE_STEP_COMPONENTS = [
  GeneralStep,
  ContactStep,
  ConfigurationStep,
  CarriersStep,
  NotesStep,
  PlanStep,
  RateStep,
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
  title,
}: EmployerFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: createEmployer, isPending: isCreating } = useCreateEmployer()
  const { mutate: updateEmployer, isPending: isUpdating } = useUpdateEmployer()
  const isPending = isCreating || isUpdating

  const normalizedMode: EmployerFormMode =
    mode === 'edit' ? 'edit-general' : mode

  const isEditMode =
    normalizedMode === 'edit-general' || normalizedMode === 'edit-plan'

  const stepComponents = useMemo(() => {
    if (normalizedMode === 'edit-general') return GENERAL_EDIT_STEP_COMPONENTS
    if (normalizedMode === 'edit-plan') return PLAN_EDIT_STEP_COMPONENTS
    return CREATE_STEP_COMPONENTS
  }, [normalizedMode])

  const steps = useMemo(() => {
    if (normalizedMode === 'edit-general') return EMPLOYER_GENERAL_STEPS
    if (normalizedMode === 'edit-plan') return EMPLOYER_PLAN_STEPS
    return EMPLOYER_STEPS
  }, [normalizedMode])

  const schema = useMemo(() => {
    if (normalizedMode === 'edit-general') return employerGeneralEditSchema
    if (normalizedMode === 'edit-plan') return employerPlanEditSchema
    return employerSchema
  }, [normalizedMode])

  const resolvedTitle = useMemo(() => {
    if (title) return title
    if (normalizedMode === 'edit-general') return formCopy.titles.editGeneral
    if (normalizedMode === 'edit-plan') return formCopy.titles.editPlan
    return formCopy.titles.create
  }, [normalizedMode, title])

  const form = useForm<EmployerFormValues>({
    resolver: zodResolver(schema) as Resolver<EmployerFormValues>,
    defaultValues: {
      ...EMPLOYER_DEFAULT_VALUES,
      ...defaultValues,
      ...initialValues,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  useEffect(() => {
    if (isEditMode && initialValues) {
      form.reset({
        ...EMPLOYER_DEFAULT_VALUES,
        ...initialValues,
      })
      setCurrentStep(0)
    }
  }, [form, initialValues, isEditMode])

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
    const fields = getEmployerStepValidationFields(currentStep, normalizedMode)
    const isValid = await form.trigger(fields)

    if (!isValid) {
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const onSubmit = (data: EmployerFormValues) => {
    const payload: EmployerUpsertRequest = {
      name: data.name,
      parentCompanyId: data.parentCompanyId || null,
      address1: data.address1,
      address2: data.address2 || null,
      city: data.city,
      state: data.state || null,
      zip: data.zip,

      contactFirst: data.contactFirst,
      contactLast: data.contactLast,
      title: data.contactTitle || null,
      phone: data.phone || null,
      fax: data.fax || null,
      email: data.email || null,

      carrierIds: data.carrierIds,

      groupNumber: data.groupNumber,
      policyNumber: data.policyNumber || null,
      tpacNumber: data.tpacNumber || null,
      monthlyAdminFee: data.monthlyAdminFee ?? null,
      status: data.status,
      isPaper: data.isPaper,
      allowCobra: data.allowCobra,
      isPano: data.isPano,
      renewalDate: data.renewalDate || null,
      initialNotificationStartOn: data.initialNotificationStartOn || null,

      notes: data.notes || null,

      planId: data.planId || null,
      cgnGroupNumber: data.cgnGroupNumber || null,
      billerAccountNumber: data.billerAccountNumber || null,
      cgnCustomerNumber: data.cgnCustomerNumber || null,
      brokerCodeId: data.brokerCodeId || null,
      isActive: data.isActive ?? true,
      planRates:
        data.planRates && data.planRates.length > 0 ? data.planRates : null,
    }

    if (isEditMode && employerId) {
      updateEmployer(
        { id: employerId, data: payload },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
    } else {
      createEmployer(payload, {
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

  const saveLabel = isEditMode
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
              <StepComponent />
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
