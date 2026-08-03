import { useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Form } from '#/components/ui/Form'
import { CarriersStep } from '#/components/admin/parent-company/CarriersStep.tsx'
import { ContactStep } from '#/components/admin/parent-company/ContactStep.tsx'
import { GeneralStep } from '#/components/admin/parent-company/GeneralStep.tsx'
import { NotesStep } from '#/components/admin/parent-company/NotesStep.tsx'
import { ReviewStep } from '#/components/admin/parent-company/ReviewStep.tsx'
import { Stepper } from '#/components/admin/parent-company/Stepper.tsx'
import {
  PARENT_COMPANY_DEFAULT_VALUES,
  PARENT_COMPANY_STEPS,
} from '#/components/admin/parent-company/parent-company-steps.ts'
import { parentCompanySchema } from '#/components/admin/parent-company/parent-company.schema.ts'
import { useCreateParentCompany } from '#/hooks/parent-company/useCreateParentCompany.ts'
import { getStepValidationFields } from '#/utils/parent-company/getStepValidationFields.ts'

import type { ParentCompanyFormValues } from '#/types/parent-company.ts'

interface CreateParentCompanyFormProps {
  onSuccess?: () => void
}

const STEP_COMPONENTS = [
  GeneralStep,
  ContactStep,
  CarriersStep,
  NotesStep,
  ReviewStep,
] as const

export function CreateParentCompanyForm({
  onSuccess,
}: CreateParentCompanyFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: createParentCompany, isPending } = useCreateParentCompany()

  const form = useForm<ParentCompanyFormValues>({
    resolver: zodResolver(parentCompanySchema),
    defaultValues: PARENT_COMPANY_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === PARENT_COMPANY_STEPS.length - 1
  const StepComponent = STEP_COMPONENTS[currentStep]

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((step) => step - 1)
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
              Site Manager
            </p>
            <h1 className="display-title mt-1 text-2xl font-bold text-sidebar-foreground">
              Create Parent Company
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
                    Please fix the highlighted fields before saving.
                  </p>
                </div>
              )}
          </div>

          <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm sm:px-8">
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep || isPending}
                className="h-9 rounded-md border-slate-200 px-6 font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
              >
                Back
              </Button>

              {isLastStep ? (
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="h-9 rounded-md bg-tan-dark px-6 font-semibold text-white shadow-xs hover:bg-tan-dark/90 disabled:opacity-70"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => void handleNext()}
                  className="h-9 rounded-md bg-tan-dark px-6 font-semibold text-white shadow-xs hover:bg-tan-dark/90"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
