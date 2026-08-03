interface RoutePlaceholderPageProps {
  title: string
  section: string
}

export function RoutePlaceholderPage({
  title,
  section,
}: RoutePlaceholderPageProps) {
  return (
    <section className="island-shell rounded-2xl p-6">
      <p className="island-kicker">{section}</p>
      <h1 className="display-title mt-3 text-3xl font-bold text-slate-900">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        This page is ready for the {title.toLowerCase()} workflow.
      </p>
    </section>
  )
}
