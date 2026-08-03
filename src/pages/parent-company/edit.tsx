import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, Loader2 } from 'lucide-react'

import { ParentCompanyForm } from '#/components/admin/parent-company/ParentCompanyForm.tsx'
import { Label } from '#/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { PARENT_COMPANY_CONTENT } from '#/content/admin/parent-company-content.ts'
import { useParentCompanies } from '#/hooks/parent-company/useParentCompanies.ts'
import { useParentCompany } from '#/hooks/parent-company/useParentCompany.ts'
import { ROUTES } from '#/static/routes.ts'
import { mapParentCompanyDetailToFormValues } from '#/utils/parent-company/mapParentCompanyDetailToFormValues.ts'

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

  const handleSuccess = () => {
    navigate({ to: ROUTES.ADMIN_PARENT_COMPANIES })
  }

  const initialValues =
    parentCompanyDetail &&
    mapParentCompanyDetailToFormValues(parentCompanyDetail)

  return (
    <main className="page-wrap mx-auto max-w-5xl py-8">
      <div className="mb-6">
        <p className="island-kicker">{copy.kicker}</p>
        <h1 className="display-title mt-3 text-3xl font-bold text-slate-900">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">{copy.description}</p>
      </div>

      <div className="mb-8 max-w-md space-y-2">
        <Label
          htmlFor="parent-company-select"
          className="text-sm font-semibold text-slate-700"
        >
          {copy.selectLabel}
        </Label>
        <Select
          value={selectedParentCompanyId}
          onValueChange={setSelectedParentCompanyId}
          disabled={isLoadingList || isListError}
        >
          <SelectTrigger
            id="parent-company-select"
            className="h-10 w-full border-slate-200 bg-white"
          >
            <SelectValue
              placeholder={
                isLoadingList
                  ? copy.selectLoadingPlaceholder
                  : copy.selectPlaceholder
              }
            />
          </SelectTrigger>
          <SelectContent>
            {parentCompanies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isListError ? (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {copy.errors.listLoad}
          </p>
        ) : null}
      </div>

      {!selectedParentCompanyId ? (
        <p className="text-sm text-slate-500">{copy.selectPrompt}</p>
      ) : null}

      {selectedParentCompanyId && isLoadingDetail ? (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="size-4 animate-spin" />
          {copy.loadingDetails}
        </div>
      ) : null}

      {selectedParentCompanyId && isDetailError ? (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {copy.errors.detailLoad}
        </p>
      ) : null}

      {selectedParentCompanyId && initialValues ? (
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
