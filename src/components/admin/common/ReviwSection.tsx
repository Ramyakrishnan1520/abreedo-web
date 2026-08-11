export interface ReviewSectionProps {
  title: string
  items: Array<{ label: string; value: string | undefined | null }>
  emptyValue?: string
}

export function ReviewSection({
  title,
  items,
  emptyValue = '—',
}: ReviewSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-tan-dark">
        {title}
      </h4>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="space-y-0.5">
            <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
            <dd className="font-semibold text-slate-900">
              {item.value && item.value.trim() !== ''
                ? item.value
                : emptyValue}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ReviewSection