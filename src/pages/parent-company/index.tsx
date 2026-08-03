import { SelectionCard } from '#/components/admin/parent-company/selection-card'
import { PARENT_COMPANY_CONTENT } from '#/content/admin/parent-company-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { pages } = PARENT_COMPANY_CONTENT

export function ParentCompaniesPage() {
  return (
    <main className="page-wrap py-8">
      <div className="mb-8">
        <p className="island-kicker">{pages.index.kicker}</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          {pages.index.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {pages.index.description}
        </p>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-base font-semibold uppercase tracking-wider text-slate-500 mb-4">
          {pages.index.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={pages.index.cards.newSetup.title}
            description={pages.index.cards.newSetup.description}
            to={ROUTES.ADMIN_PARENT_COMPANIES_NEW}
          />

          <SelectionCard
            title={pages.index.cards.update.title}
            description={pages.index.cards.update.description}
            to={ROUTES.ADMIN_PARENT_COMPANIES_EDIT}
          />
        </div>
      </div>
    </main>
  )
}
