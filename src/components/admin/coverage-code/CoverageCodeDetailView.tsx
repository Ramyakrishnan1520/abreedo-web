import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  FileCode2,
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
import { useInfiniteCarrierOptions } from '#/hooks/carrier/use-infinite-carrier-options.ts'
import { useCoverageCodeById } from '#/hooks/coverage-code/useCoverageCodeById'
import { useDeleteCoverageCode } from '#/hooks/coverage-code/useDeleteCoverageCode'
import { useGetCoverageClasses } from '#/hooks/coverage-code/useGetCoverageClasses.ts'
import { useGetCoverageTypes } from '#/hooks/coverage-code/useGetCoverageTypes.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { mapCoverageCodeDetailToFormValues } from '#/utils/mapCoverageCodeDetailToFormValues.ts'

interface CoverageCodeDetailViewProps {
  coverageCodeId: string
  onBack: () => void
  onEdit: () => void
  onDeleteSuccess: () => void
}

const copy = COVERAGE_CODE_CONTENT.pages.edit
const reviewCopy = COVERAGE_CODE_CONTENT.reviewStep

export function CoverageCodeDetailView({
  coverageCodeId,
  onBack,
  onEdit,
  onDeleteSuccess,
}: CoverageCodeDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const {
    data: coverageCodeDetail,
    isLoading,
    isError,
  } = useCoverageCodeById(coverageCodeId)

  const { carriers } = useInfiniteCarrierOptions()
  const { data: coverageClasses = [] } = useGetCoverageClasses()
  const { data: coverageTypes = [] } = useGetCoverageTypes()
  const { mutate: deleteCoverageCode, isPending: isDeleting } =
    useDeleteCoverageCode()

  const values = useMemo(
    () =>
      coverageCodeDetail
        ? mapCoverageCodeDetailToFormValues(coverageCodeDetail)
        : null,
    [coverageCodeDetail],
  )

  const carrierName = useMemo(() => {
    if (!values?.carrierId) return undefined
    return (
      carriers.find((c) => String(c.id) === String(values.carrierId))?.name ??
      values.carrierId
    )
  }, [carriers, values?.carrierId])

  const coverageClassName = useMemo(() => {
    if (!values?.coverageClassId) return undefined
    const match = coverageClasses.find(
      (cc) => cc.coverageClassId === values.coverageClassId,
    )
    return match ? match.name || match.code : values.coverageClassId
  }, [coverageClasses, values?.coverageClassId])

  const coverageTypeName = useMemo(() => {
    if (!values?.remittanceTypeId) return undefined
    const match = coverageTypes.find(
      (ct) => ct.coverageTypeId === values.remittanceTypeId,
    )
    return match ? match.name || match.code : values.remittanceTypeId
  }, [coverageTypes, values?.remittanceTypeId])

  const generalItems = useMemo(
    () =>
      values
        ? [
            { label: reviewCopy.fields.code, value: values.code },
            { label: reviewCopy.fields.name, value: values.name },
            { label: reviewCopy.fields.carrier, value: carrierName },
            { label: reviewCopy.fields.coverageClass, value: coverageClassName },
            { label: reviewCopy.fields.remittanceType, value: coverageTypeName },
          ]
        : [],
    [values, carrierName, coverageClassName, coverageTypeName],
  )

  const processingItems = useMemo(
    () =>
      values
        ? [
            { label: reviewCopy.fields.combinationForBill, value: values.codeInvoice },
            { label: reviewCopy.fields.combinationForReports, value: values.codeReport },
            {
              label: reviewCopy.fields.useForBill,
              value: values.invoiceInclude ? reviewCopy.yes : reviewCopy.no,
            },
            { label: reviewCopy.fields.description, value: values.title },
            { label: reviewCopy.fields.shortDescription, value: values.shortTitle },
            { label: reviewCopy.fields.invoiceGroup, value: values.invoiceGroup },
          ]
        : [],
    [values],
  )

  const notesItems = useMemo(
    () => (values ? [{ label: reviewCopy.fields.notes, value: values.notes }] : []),
    [values],
  )

  const handleDelete = () => {
    deleteCoverageCode(coverageCodeId, {
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
                <FileCode2 className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {values.code}
                  </CardTitle>
                  {values.name ? (
                    <Badge variant="secondary" className="font-medium">
                      {values.name}
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
            title={reviewCopy.sections.processing}
            items={processingItems}
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
              id="coverage-code-view-delete-btn"
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
                id="coverage-code-view-back-btn"
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
                id="coverage-code-view-edit-btn"
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
