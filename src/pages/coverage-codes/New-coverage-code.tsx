import { useNavigate } from '@tanstack/react-router'

import { CoverageCodeForm } from '#/components/admin/coverage-code/CoverageCodeForm'
import { ROUTES } from '#/static/routes.ts'


function NewCoverageCodePage() {
    const navigate = useNavigate()

    const handleNavigateBack = () => {
        navigate({ to: ROUTES.ADMIN_COVERAGE_CODES })
    }

    return (
        <main className="page-wrap py-8 max-w-3xl mx-auto">
            <CoverageCodeForm
                title="New Coverage Code"
                onBack={handleNavigateBack}
                onSuccess={handleNavigateBack}
            />
        </main>
    )
}

export default NewCoverageCodePage;