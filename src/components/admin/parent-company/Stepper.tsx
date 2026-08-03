import { Check } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

import type { ParentCompanyStep } from '#/types/parent-company.ts'

interface StepperProps {
  steps: ParentCompanyStep[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Form progress" className={cn('w-full', className)}>
      <ol className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    aria-hidden
                    className={cn(
                      'h-0.5 flex-1 transition-colors',
                      isCompleted || isCurrent ? 'bg-tan-dark' : 'bg-slate-200',
                    )}
                  />
                )}

                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    isCompleted && 'border-tan-dark bg-tan-dark text-white',
                    isCurrent && 'border-tan-dark bg-white text-tan-dark shadow-sm',
                    isUpcoming && 'border-slate-200 bg-white text-slate-400',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div
                    aria-hidden
                    className={cn(
                      'h-0.5 flex-1 transition-colors',
                      isCompleted ? 'bg-tan-dark' : 'bg-slate-200',
                    )}
                  />
                )}
              </div>

              <span
                className={cn(
                  'mt-2 hidden text-center text-xs font-semibold uppercase tracking-wide sm:block',
                  isCurrent && 'text-tan-dark',
                  isCompleted && 'text-slate-700',
                  isUpcoming && 'text-slate-400',
                )}
              >
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>

      <p className="mt-3 text-center text-sm font-semibold text-slate-700 sm:hidden">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.label}
      </p>
    </nav>
  )
}
