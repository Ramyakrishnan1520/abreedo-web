import { useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, Layers, Loader2 } from 'lucide-react'

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
import { useInfiniteCoverageCodeOptions } from '#/hooks/coverage-code/use-infinite-coverage-code-options.ts'
import { useCommissionCodeOptions } from '#/hooks/commisssion-code/useCommissionCodeOptions'
import { useInfinitePlanOptions } from '#/hooks/plan/use-infinite-plan-options.ts'
import { useGroupTypeOptions } from '#/hooks/plan/useGroupTypeOptions.ts'
import { useDeletePlan } from '#/hooks/plan/useDeletePlan.ts'
import { usePlan } from '#/hooks/plan/usePlanById.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { resolveOptionLabel } from '#/utils/resolveOptionLabel.ts'

import type { ReviewSectionConfig } from '#/types/review-steps.ts'


interface PlanDetailViewProps {
  planId: string
  onBack: () => void
  onEdit: () => void
  onDeleteSuccess: () => void
}

const copy = PLAN_CONTENT.pages.edit
const reviewCopy = PLAN_CONTENT.reviewStep

export function PlanDetailView({
  planId,
  onBack,
  onEdit,
  onDeleteSuccess,
}: PlanDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const { data: planDetail, isLoading, isError } = usePlan(planId)
  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlan()

  const { coverageCodes } = useInfiniteCoverageCodeOptions()
  const { options: commissionCodeOptions } = useCommissionCodeOptions()
  const { options: groupTypeOptions } = useGroupTypeOptions()
  const { plans } = useInfinitePlanOptions()

  const coverageCodeName = useMemo(() => {
    return resolveOptionLabel(
      planDetail?.coverageCodeId,
      coverageCodes.map((c) => ({ id: c.id, name: c.description || c.code })),
      planDetail?.coverageCodeTitle,
    )
  }, [coverageCodes, planDetail?.coverageCodeId, planDetail?.coverageCodeTitle])


  const commissionCodeName = useMemo(() => {
    if (!planDetail?.commissionCodeId) return undefined
    return (
      commissionCodeOptions.find(
        (opt) => String(opt.value) === String(planDetail.commissionCodeId),
      )?.label ??
      planDetail.commissionCodeName ??
      planDetail.commissionCodeId
    )
  }, [commissionCodeOptions, planDetail?.commissionCodeId, planDetail?.commissionCodeName])

  const groupTypeName = useMemo(() => {
    if (!planDetail?.groupTypeId) return undefined
    return (
      groupTypeOptions.find((gt) => gt.value === planDetail.groupTypeId)?.label ??
      planDetail.groupTypeId
    )
  }, [groupTypeOptions, planDetail?.groupTypeId])

  const linkedPlanName = useMemo(() => {
    if (!planDetail?.linkedPlanId) return undefined
    return (
      plans.find((p) => String(p.id) === String(planDetail.linkedPlanId))?.name ??
      planDetail.linkedPlanName ??
      planDetail.linkedPlanId
    )
  }, [plans, planDetail?.linkedPlanId, planDetail?.linkedPlanName])

  const linkedPlan2Name = useMemo(() => {
    if (!planDetail?.linkedPlan2Id) return undefined
    return (
      plans.find((p) => String(p.id) === String(planDetail.linkedPlan2Id))?.name ??
      planDetail.linkedPlan2Name ??
      planDetail.linkedPlan2Id
    )
  }, [plans, planDetail?.linkedPlan2Id, planDetail?.linkedPlan2Name])

  const formattedEffectiveDate = useMemo(() => {
    if (!planDetail?.effectiveDate) return undefined
    return planDetail.effectiveDate.split('T')[0]
  }, [planDetail?.effectiveDate])

  const sections: ReviewSectionConfig[] = useMemo(
    () =>
      planDetail
        ? [
          {
            id: 'general',
            title: reviewCopy.sections.general,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.coverageCode,
                value: coverageCodeName ?? planDetail.coverageCodeTitle ?? undefined,
              },
              {
                type: 'text',
                label: reviewCopy.fields.commissionCode,
                value: commissionCodeName,
              },
              {
                type: 'text',
                label: reviewCopy.fields.option,
                value: planDetail.option ?? undefined,
              },
              {
                type: 'text',
                label: reviewCopy.fields.name,
                value: planDetail.name ?? undefined,
              },
              {
                type: 'text',
                label: reviewCopy.fields.effectiveDate,
                value: formattedEffectiveDate,
              },
              {
                type: 'text',
                label: reviewCopy.fields.groupType,
                value: groupTypeName,
              },
            ],
          },
          {
            id: 'linked',
            title: reviewCopy.sections.linked,
            items: [
              {
                type: 'text',
                label: reviewCopy.fields.linkedPlan,
                value: linkedPlanName,
              },
              {
                type: 'text',
                label: reviewCopy.fields.linkedPlan2,
                value: linkedPlan2Name,
              },
            ],
          },
        ]
        : [],
    [
      planDetail,
      coverageCodeName,
      commissionCodeName,
      formattedEffectiveDate,
      groupTypeName,
      linkedPlanName,
      linkedPlan2Name,
    ],
  )

  const handleDelete = () => {
    deletePlan(planId, {
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

  if (isError || !planDetail) {
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
                <Layers className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {planDetail.name || 'Unnamed Plan'}
                  </CardTitle>
                  {planDetail.code ? (
                    <Badge variant="secondary" className="font-medium">
                      {planDetail.code}
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
            idPrefix="plan-view"
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
