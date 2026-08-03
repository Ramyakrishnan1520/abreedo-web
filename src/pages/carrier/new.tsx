import { useNavigate } from '@tanstack/react-router'

import { CarrierForm } from '#/components/admin/carrier/CarrierForm'
import { ROUTES } from '#/static/routes.ts'

export function NewCarrierPage() {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    navigate({ to: ROUTES.ADMIN_CARRIERS })
  }

  return (
    <main className="page-wrap mx-auto max-w-4xl py-8">
      <CarrierForm
        title="New Carrier"
        onBack={handleNavigateBack}
        onSuccess={handleNavigateBack}
      />
    </main>
  )
}
