import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'

import ReviewSection from '#/components/admin/common/ReviwSection.tsx'
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


  const generalItems = useMemo(
    () =>
      values
        ? [
            { label: reviewCopy.fields.name, value: values.name },
            { label: reviewCopy.fields.groupTitle, value: values.groupTitle },
            {
              label: reviewCopy.fields.allowFlexibleDates,
              value: values.allowFlexibleDates ? reviewCopy.yes : reviewCopy.no,
            },
          ]
        : [],
    [values],
  )

  const addressItems = useMemo(
    () =>
      values
        ? [
            { label: reviewCopy.fields.address1, value: values.address1 },
            { label: reviewCopy.fields.address2, value: values.address2 },
            { label: reviewCopy.fields.city, value: values.city },
            { label: reviewCopy.fields.state, value: stateName },
            { label: reviewCopy.fields.zip, value: values.zip },
          ]
        : [],
    [values, stateName],
  )

  const contactItems = useMemo(
    () =>
      values
        ? [
            {
              label: reviewCopy.fields.contactFirstName,
              value: values.contactFirstName,
            },
            {
              label: reviewCopy.fields.contactLastName,
              value: values.contactLastName,
            },
            { label: reviewCopy.fields.phone, value: values.phone },
            { label: reviewCopy.fields.fax, value: values.fax },
            { label: reviewCopy.fields.email, value: values.email },
          ]
        : [],
    [values],
  )

  const handleDelete = () => {
    deleteCarrier(carrierId, {
      onSuccess: () => {
        onDeleteSuccess()
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
          <ReviewSection
            title={reviewCopy.sections.general}
            items={generalItems}
          />
          <ReviewSection
            title={reviewCopy.sections.primaryAddress}
            items={addressItems}
          />
          <ReviewSection
            title={reviewCopy.sections.contact}
            items={contactItems}
          />

          {/* Delete Confirmation Banner */}
          {showConfirmDelete ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-destructive">
                    {copy.confirmDeleteTitle}
                  </p>
                  <p className="text-xs text-slate-600">
                    {copy.confirmDeletePrompt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isDeleting}
                    className="h-8 border-slate-300"
                  >
                    {copy.cancel}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 gap-1.5"
                  >
                    {isDeleting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                    {copy.confirmDelete}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Integrated Actions Bar */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5 mt-6">
            <Button
              id="carrier-view-delete-btn"
              type="button"
              variant="destructive"
              onClick={() => setShowConfirmDelete(true)}
              disabled={isDeleting || showConfirmDelete}
              className="h-9 gap-1.5 rounded-md px-5 font-semibold shadow-xs"
            >
              <Trash2 className="size-4" />
              {copy.deleteButton}
            </Button>

            <div className="flex items-center gap-3">
              <Button
                id="carrier-view-back-btn"
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isDeleting}
                className="h-9 gap-1.5 rounded-md border-slate-200 px-5 font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
              >
                <ArrowLeft className="size-4" />
                {copy.backButton}
              </Button>
              <Button
                id="carrier-view-edit-btn"
                type="button"
                onClick={onEdit}
                disabled={isDeleting}
                className="h-9 gap-1.5 rounded-md bg-tan-dark px-5 font-semibold text-white shadow-xs hover:bg-tan-dark/90"
              >
                <Pencil className="size-4" />
                {copy.editButton}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
