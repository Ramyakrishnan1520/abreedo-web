import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertCircle,
  Building2,
  Loader2,
  MousePointerClick,
  PencilLine,
} from 'lucide-react'

import { CoverageCodeForm } from '#/components/admin/coverage-code/CoverageCodeForm.tsx'
import { CoverageCodeSearchSelect } from '#/components/admin/coverage-code/CoverageCodeSearchSelect.tsx'
import { Badge } from '#/components/ui/badge.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Label } from '#/components/ui/label.tsx'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { useCoverageCodes } from '#/hooks/coverage-code/use-coverage-codes.ts'
import { useCoverageCodeById } from '#/hooks/coverage-code/useCoverageCodeById.ts'
import { ROUTES } from '#/static/routes.ts'
import { mapCoverageCodeDetailToFormValues } from '#/utils/mapCoverageCodeDetailToFormValues.ts'

const { pages } = COVERAGE_CODE_CONTENT
const copy = pages.edit

export function EditCoverageCodePage() {
  const navigate = useNavigate()
  const [selectedCoverageCodeId, setSelectedCoverageCodeId] = useState<
    string | undefined
  >()

  const {
    data: coverageCodesResult,
    isLoading: isLoadingList,
    isError: isListError,
  } = useCoverageCodes({ pageIndex: 0, pageSize: 100 })

  const coverageCodeOptions = useMemo(
    () =>
      (coverageCodesResult?.items ?? []).map((codeItem) => ({
        id: String(codeItem.id),
        code: codeItem.code,
        description: codeItem.description,
      })),
    [coverageCodesResult?.items],
  )

  const {
    data: coverageCodeDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useCoverageCodeById(selectedCoverageCodeId)

  const selectedCodeName = useMemo(() => {
    const item = coverageCodeOptions.find((opt) => opt.id === selectedCoverageCodeId)
    if (!item) return undefined
    return item.description ? `${item.code} - ${item.description}` : item.code
  }, [coverageCodeOptions, selectedCoverageCodeId])

  const handleSuccess = () => {
    navigate({ to: ROUTES.ADMIN_COVERAGE_CODES })
  }

  const handleBack = () => {
    navigate({ to: ROUTES.ADMIN_COVERAGE_CODES })
  }

  const initialValues =
    coverageCodeDetail && mapCoverageCodeDetailToFormValues(coverageCodeDetail)

  const showEmptyState =
    !selectedCoverageCodeId && !isLoadingList && !isListError
  const showForm = selectedCoverageCodeId && initialValues && !isLoadingDetail

  return (
    <main className="page-wrap mx-auto max-w-5xl space-y-6 py-8">
      <div className="space-y-2">
        <p className="island-kicker">{copy.kicker}</p>
        <h1 className="display-title text-3xl font-bold text-slate-900 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="max-w-2xl text-slate-600">{copy.description}</p>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 bg-linear-to-br from-tan-light/30 via-white to-white pb-5">
          <div className="flex gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-tan-dark/15 bg-white text-tan-dark shadow-xs">
              <Building2 className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg">{copy.selectLabel}</CardTitle>
              <CardDescription>{copy.selectCardDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          <div className="max-w-xl space-y-2">
            <Label
              htmlFor="coverage-code-select"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              {copy.selectLabel}
            </Label>
            <CoverageCodeSearchSelect
              id="coverage-code-select"
              options={coverageCodeOptions}
              value={selectedCoverageCodeId}
              onValueChange={setSelectedCoverageCodeId}
              disabled={isListError}
              isLoading={isLoadingList}
              placeholder={copy.selectPlaceholder}
              loadingPlaceholder={copy.selectLoadingPlaceholder}
              searchPlaceholder={copy.selectSearchPlaceholder}
              noResultsMessage={copy.selectNoResults}
            />
          </div>
          {isListError ? (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {copy.errors.listLoad}
            </p>
          ) : null}
          {selectedCodeName && !isLoadingDetail ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500">
                {copy.editingLabel}
              </span>
              <Badge
                variant="secondary"
                className="gap-1.5 border border-slate-200 bg-slate-50 font-semibold text-slate-800"
              >
                <PencilLine className="size-3.5 text-tan-dark" aria-hidden />
                {selectedCodeName}
              </Badge>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {showEmptyState ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/40 shadow-none">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-xs">
              <MousePointerClick className="size-7" aria-hidden />
            </div>
            <p className="text-base font-semibold text-slate-800">
              {copy.emptyStateTitle}
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              {copy.selectPrompt}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {selectedCoverageCodeId && isLoadingDetail ? (
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="flex items-center justify-center gap-3 py-16 text-sm text-slate-600">
            <Loader2 className="size-5 animate-spin text-tan-dark" />
            {copy.loadingDetails}
          </CardContent>
        </Card>
      ) : null}

      {selectedCoverageCodeId && isDetailError ? (
        <Card className="border-destructive/30 bg-destructive/5 shadow-none">
          <CardContent className="flex items-center gap-2 py-6 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {copy.errors.detailLoad}
          </CardContent>
        </Card>
      ) : null}

      {showForm ? (
        <CoverageCodeForm
          key={selectedCoverageCodeId}
          mode="edit"
          coverageCodeId={selectedCoverageCodeId}
          initialValues={initialValues}
          onBack={handleBack}
          onSuccess={handleSuccess}
        />
      ) : null}
    </main>
  )
}
