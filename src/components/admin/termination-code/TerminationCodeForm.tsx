import { useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'

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
import { FormNavigationActions } from '#/components/admin/common/FormNavigationActions.tsx'
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
          <FormNavigationActions
            idPrefix="termination-code"
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
