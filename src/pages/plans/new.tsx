import { useNavigate } from '@tanstack/react-router'

import { PlanForm } from '#/components/admin/plan/PlanForm'
import { ROUTES } from '#/static/routes.ts'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'

export function NewPlanPage() {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    void navigate({ to: ROUTES.ADMIN_PLANS })
  }

  return (
    <main className="page-wrap mx-auto max-w-4xl py-8">
      <PlanForm
        title={PLAN_CONTENT.pages.new.formTitle}
        onBack={handleNavigateBack}
        onSuccess={handleNavigateBack}
      />
    </main>
  )
}
