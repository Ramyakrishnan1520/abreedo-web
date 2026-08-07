import { useNavigate } from '@tanstack/react-router'

import { CarrierForm } from '#/components/admin/carrier/CarrierForm'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { ROUTES } from '#/static/routes.ts'

export function NewCarrierPage() {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    navigate({ to: ROUTES.ADMIN_CARRIERS })
  }

  return (
    <main className="page-wrap mx-auto max-w-5xl py-8">
      <CarrierForm
        title={CARRIER_CONTENT.pages.new.formTitle}
        onBack={handleNavigateBack}
        onSuccess={handleNavigateBack}
      />
    </main>
  )
}
