import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertCircle,
  Building2,
  Loader2,
  MousePointerClick,
  PencilLine,
} from 'lucide-react'

import { ParentCompanyForm } from '#/components/admin/parent-company/ParentCompanyForm.tsx'
import { ParentCompanySearchSelect } from '#/components/admin/parent-company/ParentCompanySearchSelect.tsx'
import { Badge } from '#/components/ui/badge.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Label } from '#/components/ui/label.tsx'
import { PARENT_COMPANY_CONTENT } from '#/utils/parent-company-content.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { useParentCompany } from '#/hooks/parent-company/useParentCompany.ts'
import { ROUTES } from '#/static/routes.ts'
import { mapParentCompanyDetailToFormValues } from '#/utils/mapParentCompanyDetailToFormValues.ts'

const { pages } = PARENT_COMPANY_CONTENT
const copy = pages.edit

export function EditParentCompanyPage() {
  const navigate = useNavigate()
  const [selectedParentCompanyId, setSelectedParentCompanyId] = useState<
    string | undefined
  >()

  const {
    data: parentCompanies = [],
    isLoading: isLoadingList,
    isError: isListError,
  } = useParentCompanies()

  const {
    data: parentCompanyDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useParentCompany(selectedParentCompanyId)

  const selectedCompanyName = useMemo(
    () =>
      parentCompanies.find((company) => company.id === selectedParentCompanyId)
        ?.name,
    [parentCompanies, selectedParentCompanyId],
  )

  const handleSuccess = () => {
    navigate({ to: ROUTES.ADMIN_PARENT_COMPANIES })
  }

  const initialValues =
    parentCompanyDetail &&
    mapParentCompanyDetailToFormValues(parentCompanyDetail)

  const showEmptyState =
    !selectedParentCompanyId && !isLoadingList && !isListError
  const showForm = selectedParentCompanyId && initialValues && !isLoadingDetail

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
              htmlFor="parent-company-select"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              {copy.selectLabel}
            </Label>
            <ParentCompanySearchSelect
              id="parent-company-select"
              options={parentCompanies}
              value={selectedParentCompanyId}
              onValueChange={setSelectedParentCompanyId}
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
          {selectedCompanyName && !isLoadingDetail ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500">
                {copy.editingLabel}
              </span>
              <Badge
                variant="secondary"
                className="gap-1.5 border border-slate-200 bg-slate-50 font-semibold text-slate-800"
              >
                <PencilLine className="size-3.5 text-tan-dark" aria-hidden />
                {selectedCompanyName}
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

      {selectedParentCompanyId && isLoadingDetail ? (
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="flex items-center justify-center gap-3 py-16 text-sm text-slate-600">
            <Loader2 className="size-5 animate-spin text-tan-dark" />
            {copy.loadingDetails}
          </CardContent>
        </Card>
      ) : null}

      {selectedParentCompanyId && isDetailError ? (
        <Card className="border-destructive/30 bg-destructive/5 shadow-none">
          <CardContent className="flex items-center gap-2 py-6 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {copy.errors.detailLoad}
          </CardContent>
        </Card>
      ) : null}

      {showForm ? (
        <ParentCompanyForm
          key={selectedParentCompanyId}
          mode="edit"
          parentCompanyId={selectedParentCompanyId}
          initialValues={initialValues}
          onSuccess={handleSuccess}
        />
      ) : null}
    </main>
  )
}
