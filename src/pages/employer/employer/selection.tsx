import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { EMPLOYER_CONTENT } from '#/utils/employer-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { updateEmployers } = EMPLOYER_CONTENT.pages

export function EmployerSelectionPage() {
  return (
    <main className="page-wrap py-8">
      <div className="mb-8">
        <p className="island-kicker">{updateEmployers.kicker}</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          {updateEmployers.title}
        </h1>
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-slate-500">
          {updateEmployers.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={updateEmployers.cards.new.title}
            description={updateEmployers.cards.new.description}
            to={ROUTES.ADMIN_EMPLOYERS_NEW}
          />

          <SelectionCard
            title={updateEmployers.cards.update.title}
            description={updateEmployers.cards.update.description}
            to={ROUTES.ADMIN_EMPLOYERS_EDIT}
          />
        </div>
      </div>
    </main>
  )
}
