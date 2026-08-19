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
import { useDeleteParentCompany } from '#/hooks/parent-company/useDeleteParentCompany.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { useParentCompany } from '#/hooks/parent-company/useParentCompany.ts'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { mapParentCompanyDetailToFormValues } from '#/utils/mapParentCompanyDetailToFormValues.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'

import type { ReviewSectionConfig } from '#/types/review-steps.ts'

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
  const {
    data: parentCompanyDetail,
    isLoading,
    isError,
  } = useParentCompany(parentCompanyId)
  const { data: states } = useGetStates()
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
    return states?.find((s) => s.id === values.state)?.name ?? values.state
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
                label: reviewCopy.fields.fullName,
                value: values.fullName,
              },
              {
                type: 'text',
                label: PARENT_COMPANY_CONTENT.notesStep.allowCobraLabel,
                value: values.allowCobra ? 'Yes' : 'No',
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
                label: reviewCopy.fields.zipCode,
                value: values.zipCode,
              },
            ],
          },
          {
            id: 'contact',
            title: reviewCopy.sections.contact,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.firstName,
                value: values.contact.firstName,
              },
              {
                type: 'text',
                label: reviewCopy.fields.lastName,
                value: values.contact.lastName,
              },
              {
                type: 'text',
                label: reviewCopy.fields.phone,
                value: values.contact.phoneNumber,
              },
              {
                type: 'text',
                label: reviewCopy.fields.alternativePhone,
                value: values.contact.alternativePhoneNumber,
              },
              {
                type: 'text',
                label: reviewCopy.fields.fax,
                value: values.contact.fax,
              },
              {
                type: 'text',
                label: reviewCopy.fields.email,
                value: values.contact.email,
              },
              {
                type: 'text',
                label: reviewCopy.fields.website,
                value: values.contact.website,
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
            id: 'notes',
            title: reviewCopy.sections.notes,
            items: [
              {
                type: 'multiline',
                value: values.notes,
              },
            ],
          },
        ]
        : [],
    [values, stateName, selectedCarrierNames],
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
            idPrefix="parent-company-view"
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
