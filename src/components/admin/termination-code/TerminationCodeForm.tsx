import { useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'

import { GeneralStep } from '#/components/admin/termination-code/GeneralStep.tsx'
import { ReviewStep } from '#/components/admin/termination-code/ReviewStep.tsx'
import {
  TERMINATION_CODE_DEFAULT_VALUES,
  TERMINATION_CODE_STEPS,
} from '#/components/admin/termination-code/termination-code-steps.ts'
import {
  terminationCodeSchema,
  type TerminationCodeFormValues,
} from '#/components/admin/termination-code/termination-code.schema.ts'
import { Stepper } from '#/components/admin/common/Stepper'
import { Button } from '#/components/ui/button.tsx'
import { Form } from '#/components/ui/Form'
import { useCreateTerminationCode } from '#/hooks/termination-code/useCreateTerminationCode.ts'
import { useUpdateTerminationCode } from '#/hooks/termination-code/useUpdateTerminationCode.ts'
import { getTerminationCodeStepValidationFields } from '#/utils/getTerminationCodeStepValidationFields.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

const { form: formCopy } = TERMINATION_CODE_CONTENT

interface TerminationCodeFormProps {
  mode?: 'create' | 'edit'
  terminationCodeId?: string
  defaultValues?: Partial<TerminationCodeFormValues>
  initialValues?: Partial<TerminationCodeFormValues>
  onBack?: () => void
  onSuccess?: () => void
  title?: string
}

const STEP_COMPONENTS = [GeneralStep, ReviewStep] as const

export function TerminationCodeForm({
  mode = 'create',
  terminationCodeId,
  defaultValues,
  initialValues,
  onBack,
  onSuccess,
  title,
}: TerminationCodeFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: createTerminationCode, isPending: isCreating } =
    useCreateTerminationCode()
  const { mutate: updateTerminationCode, isPending: isUpdating } =
    useUpdateTerminationCode()
  const isPending = isCreating || isUpdating

  const resolvedTitle =
    title ??
    (mode === 'edit'
      ? TERMINATION_CODE_CONTENT.form.titles.edit
      : TERMINATION_CODE_CONTENT.form.titles.create)

  const form = useForm<TerminationCodeFormValues>({
    resolver: zodResolver(terminationCodeSchema),
    defaultValues: {
      ...TERMINATION_CODE_DEFAULT_VALUES,
      ...defaultValues,
      ...initialValues,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TERMINATION_CODE_STEPS.length - 1
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
    const fields = getTerminationCodeStepValidationFields(currentStep)
    const isValid = await form.trigger(fields)

    if (isValid) {
      setCurrentStep((step) => step + 1)
    }
  }

  const onSubmit = (data: TerminationCodeFormValues) => {
    const actionCode = data.cobraNotice ? 1 : 2
    const payload = {
      code: data.code,
      name: data.name,
      title: data.name,
      bccCode: data.bccCode ?? '',
      nepaCode: data.nepaCode ?? '',
      actionCode,
      cobraNotice: data.cobraNotice,
      cobraTerm: data.cobraTerm,
      cobraMonths: data.cobraNotice ? data.cobraMonths : 0,
      coverageMonths: data.cobraNotice ? data.cobraMonths : 0,
    }

    if (mode === 'edit' && terminationCodeId) {
      updateTerminationCode(
        { id: terminationCodeId, data: payload },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
    } else {
      createTerminationCode(payload, {
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
          steps={TERMINATION_CODE_STEPS}
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
          <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm sm:px-8">
            <div className="flex items-center justify-between gap-3">
              <Button
                id="termination-code-back-btn"
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
                className="h-9 rounded-md border-slate-200 px-6 font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
              >
                {formCopy.navigation.back}
              </Button>

              {isLastStep ? (
                <Button
                  id="termination-code-save-btn"
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="h-9 rounded-md bg-tan-dark px-6 font-semibold text-white shadow-xs hover:bg-tan-dark/90 disabled:opacity-70"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    saveLabel
                  )}
                </Button>
              ) : (
                <Button
                  id="termination-code-next-btn"
                  type="button"
                  onClick={() => void handleNext()}
                  className="h-9 rounded-md bg-tan-dark px-6 font-semibold text-white shadow-xs hover:bg-tan-dark/90"
                >
                  {formCopy.navigation.next}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
