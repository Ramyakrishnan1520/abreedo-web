import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { employerSetup } = EMPLOYER_CONTENT.pages

export function EmployerSetupTaskPage() {
  return (
    <main className="page-wrap">
      <div className="mb-5">
        <h1 className="display-title text-3xl font-bold text-slate-900">
          {employerSetup.title}
        </h1>
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-5 text-base font-semibold uppercase tracking-wider text-slate-500">
          {employerSetup.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={employerSetup.cards.new.title}
            description={employerSetup.cards.new.description}
            to={ROUTES.ADMIN_EMPLOYERS_NEW}
          />

          <SelectionCard
            title={employerSetup.cards.update.title}
            description={employerSetup.cards.update.description}
            to={ROUTES.ADMIN_EMPLOYERS_EDIT}
          />
        </div>
      </div>
    </main>
  )
}
