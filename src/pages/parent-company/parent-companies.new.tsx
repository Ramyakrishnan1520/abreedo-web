import { useNavigate } from '@tanstack/react-router'

import { CreateParentCompanyForm } from '#/components/admin/parent-company/CreateParentCompanyForm.tsx'
import { ROUTES } from '#/static/routes.ts'

export function NewParentCompanyPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate({ to: ROUTES.ADMIN_PARENT_COMPANIES })
  }

  return (
    <main className="page-wrap mx-auto max-w-5xl py-8">
      <CreateParentCompanyForm onSuccess={handleSuccess} />
    </main>
  )
}
