import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { PLAN_CONTENT } from '#/utils/plan-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { pages } = PLAN_CONTENT

export function PlanSelectionPage() {
  return (
    <main className="page-wrap py-8">
      <div className="mb-8">
        <p className="island-kicker">{pages.index.kicker}</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          {pages.index.title}
        </h1>
        {pages.index.description ? (
          <p className="mt-3 max-w-2xl text-slate-600">
            {pages.index.description}
          </p>
        ) : null}
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-slate-500">
          {pages.index.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={pages.index.cards.newPlan.title}
            description={pages.index.cards.newPlan.description}
            to={ROUTES.ADMIN_PLANS_NEW}
          />

          <SelectionCard
            title={pages.index.cards.updatePlan.title}
            description={pages.index.cards.updatePlan.description}
            to={ROUTES.ADMIN_PLANS_EDIT}
          />
        </div>
      </div>
    </main>
  )
}
