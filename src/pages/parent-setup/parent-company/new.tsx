import { useNavigate } from '@tanstack/react-router'

import { ParentCompanyForm } from '#/components/admin/parent-company/ParentCompanyForm.tsx'
import { ROUTES } from '#/static/routes.ts'

export function NewParentCompanyPage() {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    navigate({ to: ROUTES.ADMIN_PARENT_COMPANIES })
  }

  return (
    <main className="page-wrap mx-auto max-w-5xl">
      <ParentCompanyForm mode="create" onSuccess={handleNavigateBack} onBack={handleNavigateBack} />
    </main>
  )
}
