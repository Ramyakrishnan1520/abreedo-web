import { SelectionCard } from '#/components/admin/parent-company/selection-card'
import { ROUTES } from '#/static/routes.ts'

export function ParentCompaniesPage() {
  const handleUpdateSelect = () => {
    console.log('Selected option: Update Current Parent Companies')
  }


  return (
    <main className="page-wrap py-8">
      <div className="mb-8">
        <p className="island-kicker">Administration</p>
        <h1 className="display-title mt-3 text-4xl font-bold text-slate-900">
          Update Parent Companies
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Select an action below to set up a new parent company or manage existing parent companies.
        </p>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-base font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Please Choose
        </h2>

        <div className="flex flex-col gap-4">
          <SelectionCard
            title="New Parent Setup"
            description="Guided Parent Setup"
            to={ROUTES.ADMIN_PARENT_COMPANIES_NEW}
          />

          <SelectionCard
            title="Update Current Parent Companies"
            description="Update Available Parent Companies"
            onClick={handleUpdateSelect}
          />
        </div>
      </div>
    </main>
  )
}


