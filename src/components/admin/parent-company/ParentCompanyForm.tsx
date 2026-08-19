import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'

import { Form } from '#/components/ui/Form'
import { CarriersStep } from '#/components/admin/parent-company/CarriersStep.tsx'
import { ContactStep } from '#/components/admin/parent-company/ContactStep.tsx'
import { GeneralStep } from '#/components/admin/parent-company/GeneralStep.tsx'
import { NotesStep } from '#/components/admin/parent-company/NotesStep.tsx'
import { ReviewStep } from '#/components/admin/parent-company/ReviewStep.tsx'
import { Stepper } from '#/components/admin/common/Stepper'
import { FormNavigationActions } from '#/components/admin/common/FormNavigationActions.tsx'
import {
  PARENT_COMPANY_DEFAULT_VALUES,
  PARENT_COMPANY_STEPS,
} from '#/components/admin/parent-company/parent-company-steps.ts'
import { parentCompanySchema } from '#/components/admin/parent-company/parent-company.schema.ts'
import { useCreateParentCompany } from '#/hooks/parent-company/useCreateParentCompany.ts'
import { useUpdateParentCompany } from '#/hooks/parent-company/useUpdateParentCompany.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { getStepValidationFields } from '#/utils/getParentCompanyStepValidationFields.ts'

import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

const { form: formCopy } = PARENT_COMPANY_CONTENT

export type ParentCompanyFormMode = 'create' | 'edit'

interface ParentCompanyFormProps {
  mode: ParentCompanyFormMode
  parentCompanyId?: string
  initialValues?: ParentCompanyFormValues
  onBack?: () => void
  onSuccess?: () => void
}

const STEP_COMPONENTS = [
  GeneralStep,
  ContactStep,
  CarriersStep,
  NotesStep,
  ReviewStep,
] as const

export function ParentCompanyForm({
  mode,
  parentCompanyId,
  initialValues,
  onBack,
  onSuccess,
}: ParentCompanyFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: createParentCompany, isPending: isCreating } =
    useCreateParentCompany()
  const { mutate: updateParentCompany, isPending: isUpdating } =
    useUpdateParentCompany()

  const isPending = isCreating || isUpdating
  const isEditMode = mode === 'edit'
  const formTitle = isEditMode ? formCopy.titles.edit : formCopy.titles.create
  const saveLabel = isEditMode
    ? formCopy.saveLabels.edit
    : formCopy.saveLabels.create

  const form = useForm<ParentCompanyFormValues>({
    resolver: zodResolver(parentCompanySchema),
    defaultValues:
      isEditMode && initialValues
        ? initialValues
        : PARENT_COMPANY_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  useEffect(() => {
    if (isEditMode && initialValues) {
      form.reset(initialValues)
      setCurrentStep(0)
    }
  }, [form, initialValues, isEditMode])

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === PARENT_COMPANY_STEPS.length - 1
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
    const fields = getStepValidationFields(currentStep)
    const isValid = await form.trigger(fields)

    if (isValid) {
      setCurrentStep((step) => step + 1)
    }
  }

  const onSubmit = (data: ParentCompanyFormValues) => {
    if (isEditMode) {
      if (!parentCompanyId) {
        return
      }

      updateParentCompany(
        { id: parentCompanyId, values: data },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
      return
    }

    createParentCompany(data, {
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

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="border-b border-slate-200 bg-sidebar px-6 py-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-tan-accent">
              {formCopy.kicker}
            </p>
            <h1 className="display-title mt-1 text-2xl font-bold text-sidebar-foreground">
              {formTitle}
            </h1>
          </div>
        </div>

        <Stepper
          steps={PARENT_COMPANY_STEPS}
          currentStep={currentStep}
          className="rounded-xl bg-white/5 px-2 py-4 sm:px-4"
        />
      </div>

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
            idPrefix="parent-company"
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
