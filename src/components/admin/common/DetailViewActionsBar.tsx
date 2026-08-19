import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { cn } from '#/lib/utils.ts'

export interface DetailViewActionsBarProps {
  idPrefix?: string
  deleteLabel?: string
  backLabel?: string
  editLabel?: string
  isDeleting?: boolean
  isDeleteDisabled?: boolean
  onDelete: () => void
  onBack: () => void
  onEdit: () => void
  className?: string
}

export function DetailViewActionsBar({
  idPrefix = 'view',
  deleteLabel = 'Delete',
  backLabel = 'Back',
  editLabel = 'Edit',
  isDeleting = false,
  isDeleteDisabled = false,
  onDelete,
  onBack,
  onEdit,
  className,
}: DetailViewActionsBarProps) {
  return (
    <div
      className={cn(
        'mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-5',
        className,
      )}
    >
      <Button
        id={`${idPrefix}-delete-btn`}
        type="button"
        variant="destructive"
        onClick={onDelete}
        disabled={isDeleting || isDeleteDisabled}
        className="h-9 gap-1.5 rounded-md px-5 font-semibold shadow-xs"
      >
        <Trash2 className="size-4" />
        {deleteLabel}
      </Button>

      <div className="flex items-center gap-3">
        <Button
          id={`${idPrefix}-back-btn`}
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isDeleting}
          className="h-9 gap-1.5 rounded-md border-slate-200 px-5 font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Button>

        <Button
          id={`${idPrefix}-edit-btn`}
          type="button"
          onClick={onEdit}
          disabled={isDeleting}
          className="h-9 gap-1.5 rounded-md bg-tan-dark px-5 font-semibold text-white shadow-xs hover:bg-tan-dark/90"
        >
          <Pencil className="size-4" />
          {editLabel}
        </Button>
      </div>
    </div>
  )
}
