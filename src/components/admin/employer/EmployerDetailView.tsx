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
import { useDeleteEmployer } from '#/hooks/employer/useDeleteEmployer.ts'
import { useEmployer } from '#/hooks/employer/useEmployerById.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { mapEmployerDetailToFormValues } from '#/utils/mapEmployerDetailToFormValues.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

interface EmployerDetailViewProps {
  employerId: string
  onBack: () => void
  onEdit: () => void
  onDeleteSuccess: () => void
}

const copy = EMPLOYER_CONTENT.pages.edit
const reviewCopy = EMPLOYER_CONTENT.reviewStep

export function EmployerDetailView({
  employerId,
  onBack,
  onEdit,
  onDeleteSuccess,
}: EmployerDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const { data: employerDetail, isLoading, isError } = useEmployer(employerId)
  const { data: states = [] } = useGetStates()
  const { data: parentCompanies = [] } = useParentCompanies()
  const { carriers } = useAvailableCarriers()
  const { mutate: deleteEmployer, isPending: isDeleting } = useDeleteEmployer()

  const values = useMemo(
    () => (employerDetail ? mapEmployerDetailToFormValues(employerDetail) : null),
    [employerDetail],
  )

  const parentCompanyName = useMemo(() => {
    if (!values?.parentCompanyId) return employerDetail?.parentCompanyName ?? undefined
    return (
      parentCompanies.find((company) => company.id === values.parentCompanyId)
        ?.name ?? employerDetail?.parentCompanyName ?? values.parentCompanyId
    )
  }, [parentCompanies, values?.parentCompanyId, employerDetail?.parentCompanyName])

  const stateName = useMemo(() => {
    if (!values?.state) return undefined
    return states.find((s) => s.id === values.state)?.name ?? values.state
  }, [states, values?.state])

  const selectedCarrierNames = useMemo(
    () =>
      values
        ? resolveSelectedCarrierOptions(
            values.carrierIds ?? [],
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
            { label: reviewCopy.fields.parentCompany, value: parentCompanyName },
          ]
        : [],
    [values, parentCompanyName],
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
              value: values.contactFirst,
            },
            {
              label: reviewCopy.fields.contactLastName,
              value: values.contactLast,
            },
            {
              label: reviewCopy.fields.contactTitle,
              value: values.contactTitle,
            },
            { label: reviewCopy.fields.phone, value: values.phone },
            { label: reviewCopy.fields.fax, value: values.fax },
            { label: reviewCopy.fields.email, value: values.email },
          ]
        : [],
    [values],
  )

  const groupItems = useMemo(
    () =>
      values
        ? [
            { label: reviewCopy.fields.groupNumber, value: values.groupNumber },
            { label: reviewCopy.fields.policyNumber, value: values.policyNumber },
            { label: reviewCopy.fields.tpacNumber, value: values.tpacNumber },
            {
              label: reviewCopy.fields.monthlyAdminFee,
              value:
                values.monthlyAdminFee !== undefined
                  ? `$${values.monthlyAdminFee}`
                  : undefined,
            },
            {
              label: reviewCopy.fields.status,
              value: values.status === 1 ? reviewCopy.yes : reviewCopy.no,
            },
            {
              label: reviewCopy.fields.isPaper,
              value: values.isPaper ? reviewCopy.yes : reviewCopy.no,
            },
            {
              label: reviewCopy.fields.allowCobra,
              value: values.allowCobra ? reviewCopy.yes : reviewCopy.no,
            },
            {
              label: reviewCopy.fields.isPano,
              value: values.isPano ? reviewCopy.yes : reviewCopy.no,
            },
            { label: reviewCopy.fields.renewalDate, value: values.renewalDate },
            {
              label: reviewCopy.fields.initialNotificationStartOn,
              value: values.initialNotificationStartOn,
            },
          ]
        : [],
    [values],
  )

  const notesItems = useMemo(
    () =>
      values
        ? [
            { label: reviewCopy.fields.notesTitle, value: values.notesTitle },
            { label: reviewCopy.fields.notes, value: values.notes },
          ]
        : [],
    [values],
  )

  const handleDelete = () => {
    deleteEmployer(employerId, {
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
                  {parentCompanyName ? (
                    <Badge variant="secondary" className="font-medium">
                      {parentCompanyName}
                    </Badge>
                  ) : null}
                  {values.groupNumber ? (
                    <Badge variant="outline" className="font-medium text-slate-600">
                      Grp: {values.groupNumber}
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
            title={reviewCopy.sections.groupDetails}
            items={groupItems}
          />
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
              id="employer-view-delete-btn"
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
                id="employer-view-back-btn"
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
                id="employer-view-edit-btn"
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
