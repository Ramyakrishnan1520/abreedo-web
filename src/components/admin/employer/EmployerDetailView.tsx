import { useMemo } from 'react'
import { AlertCircle, ArrowLeft, Building2, FileText, Loader2, NotebookPen } from 'lucide-react'

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs.tsx'
import { useAvailableCarriers } from '#/hooks/parent-company/useAvailableCarriers.ts'
import { useEmployer } from '#/hooks/employer/useEmployerById.ts'
import { useEmployerPlans } from '#/hooks/employer/useEmployerPlans.ts'
import { useGetStates } from '#/hooks/carrier/useGetStates.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import {
  buildEmployerGeneralReviewSections,
  buildEmployerPlanReviewSections,
} from '#/utils/buildEmployerReviewSections.ts'
import { mapEmployerDetailToFormValues } from '#/utils/mapEmployerDetailToFormValues.ts'
import { resolveSelectedCarrierOptions } from '#/utils/resolveSelectedCarrierOptions.ts'
import { resolveOptionLabel } from '#/utils/resolveOptionLabel.ts'

import type { ReviewSectionConfig } from '#/types/review-steps.ts'


interface EmployerDetailViewProps {
  employerId: string
  onBack: () => void
  onEditGeneral: () => void
  onEditPlan: () => void
  onDeleteSuccess?: () => void
}

const copy = EMPLOYER_CONTENT.pages.edit
const reviewCopy = EMPLOYER_CONTENT.reviewStep

export function EmployerDetailView({
  employerId,
  onBack,
  onEditGeneral,
  onEditPlan,
}: EmployerDetailViewProps) {
  const { data: employerDetail, isLoading, isError } = useEmployer(employerId)
  const { data: employerPlansResponse } = useEmployerPlans(employerId)
  const { data: states = [] } = useGetStates()
  const { data: parentCompanies = [] } = useParentCompanies()
  const { carriers } = useAvailableCarriers()

  const values = useMemo(
    () => (employerDetail ? mapEmployerDetailToFormValues(employerDetail) : null),
    [employerDetail],
  )

  const parentCompanyName = useMemo(() => {
    return resolveOptionLabel(
      values?.parentCompanyId,
      parentCompanies,
      employerDetail?.parentCompanyName,
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

  const generalSections: ReviewSectionConfig[] = useMemo(
    () =>
      buildEmployerGeneralReviewSections(values, {
        parentCompanyName,
        stateName,
        selectedCarrierNames,
      }),
    [values, parentCompanyName, stateName, selectedCarrierNames],
  )

  const planSections: ReviewSectionConfig[] = useMemo(() => {
    const plans =
      employerPlansResponse?.items && employerPlansResponse.items.length > 0
        ? employerPlansResponse.items
        : values?.planName || values?.planId
          ? [
            {
              carrierGroupNumberId: '',
              planId: values.planId || '',
              planName: values.planName,
              cgnGroupNumber: values.cgnGroupNumber,
              brokerCodeId: values.brokerCodeId,
              brokerCodeName: values.brokerCodeName,
              billerAccountNumber: values.billerAccountNumber,
              cgnCustomerNumber: values.cgnCustomerNumber,
              isActive: values.isActive,
              planRates: values.planRates ?? [],
            },
          ]
          : []

    return buildEmployerPlanReviewSections(plans)
  }, [employerPlansResponse?.items, values])

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
        <CardContent className="space-y-6 pt-6">
          <Tabs defaultValue="general" className="w-full space-y-2">
            <div className="flex justify-center pb-2">
              <TabsList className="h-auto items-center gap-1 rounded-2xl border border-tan-accent/40 bg-tan-subtle p-1.5 px-5 shadow-2xs">
                <TabsTrigger
                  value="general"
                  className="group flex items-center gap-2 rounded-xl px-8 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-white/60 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs"
                >
                  <FileText className="size-4.5 text-slate-400 transition-colors group-data-[state=active]:text-tan-dark" />
                  <span>{copy.tabs?.general ?? 'General'}</span>
                </TabsTrigger>

                <TabsTrigger
                  value="plan"
                  className="group flex items-center gap-2 rounded-xl px-8 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-white/60 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs"
                >
                  <NotebookPen className="size-4.5 text-slate-400 transition-colors group-data-[state=active]:text-tan-dark" />
                  <span>{copy.tabs?.plan ?? 'Plan'}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general" className="space-y-5">
              <ReviewStep
                copy={{ emptyValue: reviewCopy.emptyValue }}
                sections={generalSections}
                layout="cards"
                defaultOpenSection="general"
              />

              <DetailViewActionsBar
                idPrefix="employer-general-view"
                backLabel={copy.backButton}
                editLabel={copy.editGeneralButton}
                onBack={onBack}
                onEdit={onEditGeneral}
              />
            </TabsContent>

            <TabsContent value="plan" className="space-y-5">
              <ReviewStep
                copy={{ emptyValue: reviewCopy.emptyValue }}
                sections={planSections}
                layout="accordion"
                defaultOpenSection={planSections[0]?.id}
              />

              <DetailViewActionsBar
                idPrefix="employer-plan-view"
                backLabel={copy.backButton}
                editLabel={copy.editPlanButton}
                onBack={onBack}
                onEdit={onEditPlan}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
