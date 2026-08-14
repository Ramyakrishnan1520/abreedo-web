import { Loader2, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { cn } from '#/lib/utils'

export interface DeleteConfirmBannerProps {
  title?: string
  prompt?: string
  cancelLabel?: string
  confirmLabel?: string
  isDeleting?: boolean
  onCancel: () => void
  onConfirm: () => void
  className?: string
}

export function DeleteConfirmBanner({
  title = 'Delete Confirmation',
  prompt = 'Are you sure you want to delete this record? This action cannot be undone.',
  cancelLabel = 'Cancel',
  confirmLabel = 'Delete',
  isDeleting = false,
  onCancel,
  onConfirm,
  className,
}: DeleteConfirmBannerProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-destructive">{title}</p>
          <p className="text-xs text-slate-600">{prompt}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-8 border-slate-300"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-8 gap-1.5"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
