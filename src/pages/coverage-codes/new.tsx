import { useNavigate } from '@tanstack/react-router'

import { CoverageCodeForm } from '#/components/admin/coverage-code/CoverageCodeForm'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import { ROUTES } from '#/static/routes.ts'

export function NewCoverageCodePage() {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    navigate({ to: ROUTES.ADMIN_COVERAGE_CODES })
  }

  return (
    <main className="page-wrap mx-auto max-w-5xl py-8">
      <CoverageCodeForm
        title={COVERAGE_CODE_CONTENT.pages.new.formTitle}
        onBack={handleNavigateBack}
        onSuccess={handleNavigateBack}
      />
    </main>
  )
}
