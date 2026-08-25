import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { ROUTES } from '#/static/routes.ts'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

const { pages } = TERMINATION_CODE_CONTENT

export function TerminationCodeSelectionPage() {
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
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wider text-slate-500">
          {pages.index.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={pages.index.cards.new.title}
            description={pages.index.cards.new.description}
            to={ROUTES.ADMIN_TERMINATION_CODES_NEW}
          />

          <SelectionCard
            title={pages.index.cards.update.title}
            description={pages.index.cards.update.description}
            to={ROUTES.ADMIN_TERMINATION_CODES_EDIT}
          />
        </div>
      </div>
    </main>
  )
}
