import { useNavigate } from '@tanstack/react-router'

import { EmployerForm } from '#/components/admin/employer/EmployerForm.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { ROUTES } from '#/static/routes.ts'

export function NewEmployerPage() {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    navigate({ to: ROUTES.ADMIN_EMPLOYERS })
  }

  return (
    <main className="page-wrap mx-auto max-w-5xl py-8">
      <EmployerForm
        title={EMPLOYER_CONTENT.pages.new.formTitle}
        onBack={handleNavigateBack}
        onSuccess={handleNavigateBack}
      />
    </main>
  )
}
