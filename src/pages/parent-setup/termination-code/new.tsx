import { useNavigate } from '@tanstack/react-router'

import { TerminationCodeForm } from '#/components/admin/termination-code/TerminationCodeForm.tsx'
import { ROUTES } from '#/static/routes.ts'

export function NewTerminationCodePage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: ROUTES.ADMIN_TERMINATION_CODES })
  }

  const handleSuccess = () => {
    navigate({ to: ROUTES.ADMIN_TERMINATION_CODES })
  }

  return (
    <main className="page-wrap py-8">
      <TerminationCodeForm
        mode="create"
        onBack={handleBack}
        onSuccess={handleSuccess}
      />
    </main>
  )
}
