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
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useDeleteEmployer } from '#/hooks/employer/useDeleteEmployer.ts'
import { useEmployer } from '#/hooks/employer/useEmployerById.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { mapEmployerDetailToFormValues } from '#/utils/mapEmployerDetailToFormValues.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

import type { ReviewSectionConfig } from '#/types/review-steps.ts'

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
                label: reviewCopy.fields.parentCompany,
                value: parentCompanyName,
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
                value: values.contactFirst,
              },
              {
                type: 'text',
                label: reviewCopy.fields.contactLastName,
                value: values.contactLast,
              },
              {
                type: 'text',
                label: reviewCopy.fields.contactTitle,
                value: values.contactTitle,
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
          {
            id: 'carriers',
            title: reviewCopy.sections.carriers,
            items: [
              {
                type: 'badges',
                items: selectedCarrierNames,
                emptyMessage: reviewCopy.noCarriersSelected,
              },
            ],
          },
          {
            id: 'group',
            title: reviewCopy.sections.groupDetails,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.groupNumber,
                value: values.groupNumber,
              },
              {
                type: 'text',
                label: reviewCopy.fields.policyNumber,
                value: values.policyNumber,
              },
              {
                type: 'text',
                label: reviewCopy.fields.tpacNumber,
                value: values.tpacNumber,
              },
              {
                type: 'text',
                label: reviewCopy.fields.monthlyAdminFee,
                value:
                  values.monthlyAdminFee !== undefined
                    ? `$${values.monthlyAdminFee}`
                    : undefined,
              },
              {
                type: 'text',
                label: reviewCopy.fields.status,
                value:
                  values.status === 1 ? reviewCopy.yes : reviewCopy.no,
              },
              {
                type: 'text',
                label: reviewCopy.fields.isPaper,
                value: values.isPaper ? reviewCopy.yes : reviewCopy.no,
              },
              {
                type: 'text',
                label: reviewCopy.fields.allowCobra,
                value: values.allowCobra ? reviewCopy.yes : reviewCopy.no,
              },
              {
                type: 'text',
                label: reviewCopy.fields.isPano,
                value: values.isPano ? reviewCopy.yes : reviewCopy.no,
              },
              {
                type: 'text',
                label: reviewCopy.fields.renewalDate,
                value: values.renewalDate,
              },
              {
                type: 'text',
                label: reviewCopy.fields.initialNotificationStartOn,
                value: values.initialNotificationStartOn,
              },
            ],
          },
          {
            id: 'notes',
            title: reviewCopy.sections.notes,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.notesTitle,
                value: values.notesTitle,
              },
              {
                type: 'multiline',
                value: values.notes,
              },
            ],
          },
        ]
        : [],
    [values, parentCompanyName, stateName, selectedCarrierNames],
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
            idPrefix="employer-view"
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
