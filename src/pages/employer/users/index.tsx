import { RoutePlaceholderPage } from '#/components/RoutePlaceholderPage.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'

const { usersSetup } = EMPLOYER_CONTENT.pages

export function UsersSetupPage() {
  return (
    <main className="page-wrap py-8">
      <RoutePlaceholderPage
        title={usersSetup.title}
        section={usersSetup.kicker}
      />
    </main>
  )
}
