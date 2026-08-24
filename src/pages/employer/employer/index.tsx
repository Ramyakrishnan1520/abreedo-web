import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { employerSetup } = EMPLOYER_CONTENT.pages

export function EmployerSetupTaskPage() {
  return (
    <main className="page-wrap py-8">
      <div className="mb-8">
        <p className="island-kicker">{employerSetup.kicker}</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          {employerSetup.title}
        </h1>
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-slate-500">
          {employerSetup.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={employerSetup.cards.employerSetup.title}
            description={employerSetup.cards.employerSetup.description}
            to={ROUTES.ADMIN_EMPLOYERS_MANAGE}
          />

          <SelectionCard
            title={employerSetup.cards.employerGroupSetup.title}
            description={employerSetup.cards.employerGroupSetup.description}
            to={ROUTES.ADMIN_EMPLOYERS_GROUPS}
          />
        </div>
      </div>
    </main>
  )
}
