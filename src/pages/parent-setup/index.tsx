import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { PARENT_SETUP_CONTENT } from '#/utils/parent-setup-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { title, description, chooseHeading, tasks } = PARENT_SETUP_CONTENT

export function ParentSetupTasksPage() {
  return (
    <main className="page-wrap">
      <div className="mb-8">
        <h1 className="display-title text-4xl font-bold text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-slate-600">
            {description}
          </p>
        ) : null}
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-slate-500">
          {chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={tasks.parentCompany.title}
            description={tasks.parentCompany.description}
            to={ROUTES.ADMIN_PARENT_COMPANIES}
          />

          <SelectionCard
            title={tasks.carriersCoverage.title}
            description={tasks.carriersCoverage.description}
            to={ROUTES.ADMIN_CARRIERS}
          />

          <SelectionCard
            title={tasks.terminationCode.title}
            description={tasks.terminationCode.description}
            to={ROUTES.ADMIN_TERMINATION_CODES}
          />

          <SelectionCard
            title={tasks.planSetup.title}
            description={tasks.planSetup.description}
            to={ROUTES.ADMIN_PLANS}
          />
        </div>
      </div>
    </main>
  )
}
