import { SelectionCard } from '#/components/admin/parent-company/selection-card.tsx'
import { CARRIER_CONTENT } from '#/utils/carrier-content.ts'
import { ROUTES } from '#/static/routes.ts'

const { pages } = CARRIER_CONTENT

export function CarrierSelectionPage() {
  return (
    <main className="page-wrap">
      <div className="my-4">
        <h1 className="display-title text-3xl font-bold text-slate-900">
          {pages.index.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {pages.index.description}
        </p>
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-5 text-base font-semibold uppercase tracking-wider text-slate-500">
          {pages.index.chooseHeading}
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title={pages.index.cards.newCarrier.title}
            description={pages.index.cards.newCarrier.description}
            to={ROUTES.ADMIN_CARRIERS_NEW}
          />

          <SelectionCard
            title={pages.index.cards.newCoverageCode.title}
            description={pages.index.cards.newCoverageCode.description}
            to={ROUTES.ADMIN_COVERAGE_CODES_NEW}
          />

          <SelectionCard
            title={pages.index.cards.updateCarrier.title}
            description={pages.index.cards.updateCarrier.description}
            to={ROUTES.ADMIN_CARRIERS_EDIT}
          />

          <SelectionCard
            title={pages.index.cards.updateCoverageCode.title}
            description={pages.index.cards.updateCoverageCode.description}
            to={ROUTES.ADMIN_COVERAGE_CODES_EDIT}
          />
        </div>
      </div>
    </main>
  )
}
