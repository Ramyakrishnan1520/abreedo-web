import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'

import { DeleteConfirmBanner } from '#/components/admin/common/DeleteConfirmBanner.tsx'
import ReviewSection from '#/components/admin/common/ReviwSection.tsx'
import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useDeleteParentCompany } from '#/hooks/parent-company/useDeleteParentCompany.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { useParentCompany } from '#/hooks/parent-company/useParentCompany.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { mapParentCompanyDetailToFormValues } from '#/utils/mapParentCompanyDetailToFormValues.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

interface ParentCompanyDetailViewProps {
  parentCompanyId: string
  onBack: () => void
  onEdit: () => void
  onDeleteSuccess: () => void
}

const copy = PARENT_COMPANY_CONTENT.pages.edit
const reviewCopy = PARENT_COMPANY_CONTENT.reviewStep

export function ParentCompanyDetailView({
  parentCompanyId,
  onBack,
  onEdit,
  onDeleteSuccess,
}: ParentCompanyDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const { data: parentCompanyDetail, isLoading, isError } =
    useParentCompany(parentCompanyId)
  const { data: states = [] } = useGetStates()
  const { carriers } = useAvailableCarriers()
  const { mutate: deleteParentCompany, isPending: isDeleting } =
    useDeleteParentCompany()

  const values = useMemo(
    () =>
      parentCompanyDetail
        ? mapParentCompanyDetailToFormValues(parentCompanyDetail)
        : null,
    [parentCompanyDetail],
  )

  const stateName = useMemo(() => {
    if (!values?.state) return undefined
    return states.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values?.state])

  const selectedCarrierNames = useMemo(
    () =>
      values
        ? resolveSelectedCarrierOptions(
            values.carrierIds,
            carriers,
            values.linkedCarriers ?? [],
          )
        : [],
    [carriers, values],
  )

  const generalItems = useMemo(
    () =>
      values
        ? [
            { label: reviewCopy.fields.name, value: values.name },
            { label: reviewCopy.fields.fullName, value: values.fullName },
            {
              label: PARENT_COMPANY_CONTENT.notesStep.allowCobraLabel,
              value: values.allowCobra ? 'Yes' : 'No',
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
            { label: reviewCopy.fields.zipCode, value: values.zipCode },
          ]
        : [],
    [values, stateName],
  )

  const contactItems = useMemo(
    () =>
      values
        ? [
            {
              label: reviewCopy.fields.firstName,
              value: values.contact.firstName,
            },
            {
              label: reviewCopy.fields.lastName,
              value: values.contact.lastName,
            },
            {
              label: reviewCopy.fields.phone,
              value: values.contact.phoneNumber,
            },
            {
              label: reviewCopy.fields.alternativePhone,
              value: values.contact.alternativePhoneNumber,
            },
            { label: reviewCopy.fields.fax, value: values.contact.fax },
            { label: reviewCopy.fields.email, value: values.contact.email },
            { label: reviewCopy.fields.website, value: values.contact.website },
          ]
        : [],
    [values],
  )

  const notesItems = useMemo(
    () =>
      values
        ? [
            {
              label: reviewCopy.sections.notes,
              value: values.notes,
            },
          ]
        : [],
    [values],
  )

  const handleDelete = () => {
    deleteParentCompany(parentCompanyId, {
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
                  {values.fullName ? (
                    <Badge variant="secondary" className="font-medium">
                      {values.fullName}
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

          {/* Carriers Section */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-tan-dark">
              {reviewCopy.sections.carriers}
            </h4>
            {selectedCarrierNames.length === 0 ? (
              <p className="text-sm text-slate-500">
                {reviewCopy.noCarriersSelected}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedCarrierNames.map((carrier) => (
                  <Badge key={carrier.id} variant="secondary">
                    {carrier.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <ReviewSection
            title={reviewCopy.sections.notes}
            items={notesItems}
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
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5 mt-6">
            <Button
              id="parent-company-view-delete-btn"
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
                id="parent-company-view-back-btn"
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
                id="parent-company-view-edit-btn"
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
