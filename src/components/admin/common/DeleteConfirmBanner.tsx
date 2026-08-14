import { Loader2, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog.tsx'

export interface DeleteConfirmBannerProps {
  open?: boolean
  title?: string
  prompt?: string
  cancelLabel?: string
  confirmLabel?: string
  isDeleting?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmBanner({
  open = true,
  title = 'Delete Confirmation',
  prompt = 'Are you sure you want to delete this record? This action cannot be undone.',
  cancelLabel = 'Cancel',
  confirmLabel = 'Delete',
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteConfirmBannerProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isDeleting) {
          onCancel()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{prompt}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            id="delete-modal-cancel-btn"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-9 font-semibold text-slate-700"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            id="delete-modal-confirm-btn"
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isDeleting}
            className="h-9 gap-1.5 font-semibold"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              <Trash2 className="size-4 text-white" />
            )}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
