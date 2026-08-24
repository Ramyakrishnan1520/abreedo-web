import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

const { employerGroupSetup } = EMPLOYER_CONTENT.pages

export function EmployerGroupSetupPage() {
  return (
    <main className="page-wrap py-8">
      <RoutePlaceholderPage
        title={employerGroupSetup.title}
        section={employerGroupSetup.kicker}
      />
    </main>
  )
}
