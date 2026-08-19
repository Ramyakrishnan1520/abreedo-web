import { Loader2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { cn } from '#/lib/utils.ts'

export interface FormNavigationActionsProps {
  idPrefix?: string
  backLabel?: string
  nextLabel?: string
  saveLabel?: string
  isLastStep: boolean
  isPending?: boolean
  onBack: () => void
  onNext: () => void
  onSave: () => void
  className?: string
}

export function FormNavigationActions({
  idPrefix = 'form',
  backLabel = 'Back',
  nextLabel = 'Next',
  saveLabel = 'Save',
  isLastStep,
  isPending = false,
  onBack,
  onNext,
  onSave,
  className,
}: FormNavigationActionsProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm sm:px-8',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Button
          id={`${idPrefix}-back-btn`}
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
          className="h-9 rounded-md border-slate-200 px-6 font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
        >
          {backLabel}
        </Button>

        {isLastStep ? (
          <Button
            id={`${idPrefix}-save-btn`}
            type="button"
            onClick={onSave}
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
            id={`${idPrefix}-next-btn`}
            type="button"
            onClick={onNext}
            disabled={isPending}
            className="h-9 rounded-md bg-tan-dark px-6 font-semibold text-white shadow-xs hover:bg-tan-dark/90"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
