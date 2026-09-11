import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { employerAndUsers } = EMPLOYER_CONTENT.pages

export function EmployerAndUsersPage() {
  return (
    <main className="page-wrap">
      <div className="mb-5">
        <h1 className="display-title text-3xl font-bold text-slate-900">
          {employerAndUsers.title}
        </h1>
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-5 text-base font-semibold uppercase tracking-wider text-slate-500">
          {employerAndUsers.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={employerAndUsers.cards.employerSetup.title}
            description={employerAndUsers.cards.employerSetup.description}
            to={ROUTES.ADMIN_EMPLOYERS_SETUP}
          />

          <SelectionCard
            title={employerAndUsers.cards.usersSetup.title}
            description={employerAndUsers.cards.usersSetup.description}
            to={ROUTES.ADMIN_EMPLOYERS_USERS}
          />
        </div>
      </div>
    </main>
  )
}
