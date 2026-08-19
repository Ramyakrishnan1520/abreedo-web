import { useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, FileText, Loader2 } from 'lucide-react'

import { DeleteConfirmBanner } from '#/components/admin/common/DeleteConfirmBanner.tsx'
import { DetailViewActionsBar } from '#/components/admin/common/DetailViewActionsBar.tsx'
import { ReviewStep } from '#/components/admin/common/ReviewSection'
import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { useDeleteTerminationCode } from '#/hooks/termination-code/useDeleteTerminationCode'
import { useTerminationCodeById } from '#/hooks/termination-code/useTerminationCodeById'
import { mapTerminationCodeDetailToFormValues } from '#/utils/mapTerminationCodeDetailToFormValues.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { ReviewSectionConfig } from '#/types/review-steps.ts'

interface TerminationCodeDetailViewProps {
  terminationCodeId: string
  onBack: () => void
  onEdit: () => void
  onDeleteSuccess: () => void
}

const copy = TERMINATION_CODE_CONTENT.pages.edit
const reviewCopy = TERMINATION_CODE_CONTENT.reviewStep

export function TerminationCodeDetailView({
  terminationCodeId,
  onBack,
  onEdit,
  onDeleteSuccess,
}: TerminationCodeDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const {
    data: terminationCodeDetail,
    isLoading,
    isError,
  } = useTerminationCodeById(terminationCodeId)
  const { mutate: deleteTerminationCode, isPending: isDeleting } =
    useDeleteTerminationCode()

  const values = useMemo(
    () =>
      terminationCodeDetail
        ? mapTerminationCodeDetailToFormValues(terminationCodeDetail)
        : null,
    [terminationCodeDetail],
  )

  const sections: ReviewSectionConfig[] = useMemo(
    () =>
      values
        ? [
          {
            id: 'general',
            title: reviewCopy.sections.general,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.code,
                value: values.code,
              },
              {
                type: 'text',
                label: reviewCopy.fields.name,
                value: values.name,
              },
            ],
          },
          {
            id: 'additional',
            title: reviewCopy.sections.additional,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.bccCode,
                value: values.bccCode,
              },
              {
                type: 'text',
                label: reviewCopy.fields.nepaCode,
                value: values.nepaCode,
              },
            ],
          },
          {
            id: 'cobra',
            title: reviewCopy.sections.cobra,
            items: values.cobraNotice
              ? [
                {
                  type: 'text',
                  label: reviewCopy.fields.cobraNotice,
                  value: reviewCopy.yes,
                },
                {
                  type: 'text',
                  label: reviewCopy.fields.cobraTerm,
                  value: values.cobraTerm,
                },
                {
                  type: 'text',
                  label: reviewCopy.fields.cobraMonths,
                  value: String(values.cobraMonths ?? 0),
                },
              ]
              : [
                {
                  type: 'text',
                  label: reviewCopy.fields.cobraNotice,
                  value: reviewCopy.no,
                },
              ],
          },
        ]
        : [],
    [values],
  )

  const handleDelete = () => {
    deleteTerminationCode(terminationCodeId, {
      onSuccess: () => {
        onDeleteSuccess()
      },
      onError: () => {
        setShowConfirmDelete(false)
      },
    })
  }

  if (isLoading) {
    return (
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="flex items-center justify-center gap-3 py-16 text-sm text-slate-600">
          <Loader2 className="size-5 animate-spin text-tan-dark" />
          {copy.loadingDetails}
        </CardContent>
      </Card>
    )
  }

  if (isError || !values) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 shadow-none">
        <CardContent className="flex items-center justify-between py-6 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            {copy.errors.detailLoad}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-8 gap-1 border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            <ArrowLeft className="size-3.5" />
            {copy.backButton}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="overflow-hidden border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 bg-linear-to-br from-tan-light/30 via-white to-white pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-tan-dark/15 bg-white text-tan-dark shadow-xs">
                <FileText className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {values.name || values.code}
                  </CardTitle>
                  {values.code ? (
                    <Badge variant="secondary" className="font-medium">
                      {values.code}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">{copy.viewDescription}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <ReviewStep
            copy={{ emptyValue: '—' }}
            sections={sections}
            layout="accordion"
            defaultOpenSection="general"
          />

          {/* Delete Confirmation Banner */}
          {showConfirmDelete ? (
            <DeleteConfirmBanner
              title={copy.confirmDeleteTitle}
              prompt={copy.confirmDeletePrompt}
              cancelLabel={copy.cancel}
              confirmLabel={copy.confirmDelete}
              isDeleting={isDeleting}
              onCancel={() => setShowConfirmDelete(false)}
              onConfirm={handleDelete}
            />
          ) : null}

          {/* Integrated Actions Bar */}
          <DetailViewActionsBar
            idPrefix="termination-code-view"
            deleteLabel={copy.deleteButton}
            backLabel={copy.backButton}
            editLabel={copy.editButton}
            isDeleting={isDeleting}
            isDeleteDisabled={showConfirmDelete}
            onDelete={() => setShowConfirmDelete(true)}
            onBack={onBack}
            onEdit={onEdit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
