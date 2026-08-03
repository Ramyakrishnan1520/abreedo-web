import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/employer/')({
  component: EmployerHomePage,
})

function EmployerHomePage() {
  return (
    <section className="island-shell rounded-2xl p-6">
      <p className="island-kicker">Employer Portal</p>
      <h1 className="display-title mt-3 text-3xl font-bold text-slate-900">
        Welcome
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Select an option from the sidebar to manage employer group, billing, or
        reports.
      </p>
    </section>
  )
}
