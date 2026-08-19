import { useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, Building2, Loader2 } from 'lucide-react'

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
import { useCarrier } from '#/hooks/carrier/useCarrierById'
import { useDeleteCarrier } from '#/hooks/carrier/useDeleteCarrier'
import { useGetStates } from '#/hooks/carrier/useGetStates'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { mapCarrierDetailToFormValues } from '#/utils/mapCarrierDetailToFormValues.ts'

import type { ReviewSectionConfig } from '#/types/review-steps.ts'

interface CarrierDetailViewProps {
  carrierId: string
  onBack: () => void
  onEdit: () => void
  onDeleteSuccess: () => void
}

const copy = CARRIER_CONTENT.pages.edit
const reviewCopy = CARRIER_CONTENT.reviewStep

export function CarrierDetailView({
  carrierId,
  onBack,
  onEdit,
  onDeleteSuccess,
}: CarrierDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const { data: carrierDetail, isLoading, isError } = useCarrier(carrierId)
  const { data: states = [] } = useGetStates()
  const { mutate: deleteCarrier, isPending: isDeleting } = useDeleteCarrier()

  const values = useMemo(
    () => (carrierDetail ? mapCarrierDetailToFormValues(carrierDetail) : null),
    [carrierDetail],
  )

  const stateName = useMemo(() => {
    if (!values?.state) return undefined
    return states.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values?.state])

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
                label: reviewCopy.fields.name,
                value: values.name,
              },
              {
                type: 'text',
                label: reviewCopy.fields.groupTitle,
                value: values.groupTitle,
              },
              {
                type: 'text',
                label: reviewCopy.fields.allowFlexibleDates,
                value: values.allowFlexibleDates
                  ? reviewCopy.yes
                  : reviewCopy.no,
              },
            ],
          },
          {
            id: 'address',
            title: reviewCopy.sections.primaryAddress,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.address1,
                value: values.address1,
              },
              {
                type: 'text',
                label: reviewCopy.fields.address2,
                value: values.address2,
              },
              {
                type: 'text',
                label: reviewCopy.fields.city,
                value: values.city,
              },
              {
                type: 'text',
                label: reviewCopy.fields.state,
                value: stateName,
              },
              {
                type: 'text',
                label: reviewCopy.fields.zip,
                value: values.zip,
              },
            ],
          },
          {
            id: 'contact',
            title: reviewCopy.sections.contact,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.contactFirstName,
                value: values.contactFirstName,
              },
              {
                type: 'text',
                label: reviewCopy.fields.contactLastName,
                value: values.contactLastName,
              },
              {
                type: 'text',
                label: reviewCopy.fields.phone,
                value: values.phone,
              },
              {
                type: 'text',
                label: reviewCopy.fields.fax,
                value: values.fax,
              },
              {
                type: 'text',
                label: reviewCopy.fields.email,
                value: values.email,
              },
            ],
          },
        ]
        : [],
    [values, stateName],
  )

  const handleDelete = () => {
    deleteCarrier(carrierId, {
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
                <Building2 className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {values.name}
                  </CardTitle>
                  {values.groupTitle ? (
                    <Badge variant="secondary" className="font-medium">
                      {values.groupTitle}
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
            copy={{ emptyValue: '-' }}
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
            idPrefix="carrier-view"
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
