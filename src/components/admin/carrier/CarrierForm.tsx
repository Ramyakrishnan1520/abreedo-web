import { useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'

import { Form } from '#/components/ui/Form'
import { GeneralStep } from '#/components/admin/carrier/GeneralStep.tsx'
import { ContactStep } from '#/components/admin/carrier/ContactStep.tsx'
import { ReviewStep } from '#/components/admin/carrier/ReviewStep.tsx'
import { Stepper } from '#/components/admin/common/Stepper'
import { FormNavigationActions } from '#/components/admin/common/FormNavigationActions.tsx'
import {
  CARRIER_DEFAULT_VALUES,
  CARRIER_STEPS,
} from '#/components/admin/carrier/carrier-steps.ts'
import {
  carrierSchema,
  type CarrierFormValues,
} from '#/components/admin/carrier/carrier.schema.ts'
import { useCreateCarrier } from '#/hooks/carrier/useCreateCarrier.ts'
import { useUpdateCarrier } from '#/hooks/carrier/useUpdateCarrier.ts'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { getCarrierStepValidationFields } from '#/utils/getCarrierStepValidationFields.ts'

import type { CreateCarrierRequest } from '#/types/carrier.ts'

const { form: formCopy } = CARRIER_CONTENT

interface CarrierFormProps {
  mode?: 'create' | 'edit'
  carrierId?: string
  defaultValues?: Partial<CarrierFormValues>
  initialValues?: Partial<CarrierFormValues>
  onBack?: () => void
  onSuccess?: () => void
  title?: string
}

const STEP_COMPONENTS = [GeneralStep, ContactStep, ReviewStep] as const

export function CarrierForm({
  mode = 'create',
  carrierId,
  defaultValues,
  initialValues,
  onBack,
  onSuccess,
  title,
}: CarrierFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { mutate: createCarrier, isPending: isCreating } = useCreateCarrier()
  const { mutate: updateCarrier, isPending: isUpdating } = useUpdateCarrier()
  const isPending = isCreating || isUpdating

  const resolvedTitle =
    title ??
    (mode === 'edit'
      ? CARRIER_CONTENT.form.titles.edit
      : CARRIER_CONTENT.form.titles.create)

  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(carrierSchema),
    defaultValues: {
      ...CARRIER_DEFAULT_VALUES,
      ...defaultValues,
      ...initialValues,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === CARRIER_STEPS.length - 1
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
    const fields = getCarrierStepValidationFields(currentStep)
    const isValid = await form.trigger(fields)

    if (isValid) {
      setCurrentStep((step) => step + 1)
    }
  }

  const onSubmit = (data: CarrierFormValues) => {
    const payload: CreateCarrierRequest = {
      name: data.name,
      groupNumber: data.groupTitle || '',
      contactFirst: data.contactFirstName || '',
      contactLast: data.contactLastName || '',
      address1: data.address1 || '',
      address2: data.address2 || '',
      city: data.city || '',
      state: data.state || '',
      zip: data.zip || '',
      phone: data.phone || '',
      fax: data.fax || '',
      email: data.email || '',
      allowFlexibleDates: data.allowFlexibleDates,
    }

    if (mode === 'edit' && carrierId) {
      updateCarrier(
        { id: carrierId, data: payload },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
    } else {
      createCarrier(payload, {
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
          steps={CARRIER_STEPS}
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
            idPrefix="carrier"
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
