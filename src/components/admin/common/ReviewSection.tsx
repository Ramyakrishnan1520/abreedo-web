import { Badge } from '#/components/ui/badge.tsx'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion.tsx'

import type {
  ReviewCardSectionProps,
  ReviewFieldProps,
  ReviewSectionItemsProps,
  ReviewStepProps,
} from '#/types/review-steps.ts'

function ReviewField({ label, value, emptyValue }: ReviewFieldProps) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">
        {value && value.trim() !== '' ? value : emptyValue}
      </dd>
    </div>
  )
}

function ReviewCardSection({ title, children }: ReviewCardSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-tan-dark">
        {title}
      </h4>
      {children}
    </div>
  )
}

const accordionItemClassName =
  'rounded-xl border border-slate-200 bg-slate-50/50 px-4 sm:px-5 last:border-b'

const accordionTriggerClassName =
  'py-3 text-xs font-bold uppercase tracking-wider text-tan-dark hover:no-underline'

function ReviewSectionItems({
  items,
  emptyValue,
}: ReviewSectionItemsProps) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
      {items.map((item, index) => {
        if (item.type === 'text') {
          return (
            <ReviewField
              key={`${item.label}-${index}`}
              label={item.label}
              value={item.value}
              emptyValue={emptyValue}
            />
          )
        }

        if (item.type === 'multiline') {
          return (
            <div
              key={`multiline-${index}`}
              className="col-span-full space-y-0.5"
            >
              <dd className="text-sm font-semibold whitespace-pre-wrap text-slate-900">
                {item.value && item.value.trim() !== ''
                  ? item.value
                  : emptyValue}
              </dd>
            </div>
          )
        }

        return (
          <div key={`badges-${index}`} className="col-span-full">
            {item.items.length === 0 ? (
              <p className="text-sm text-slate-500">{item.emptyMessage}</p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {item.items.map((badge) => (
                  <Badge key={badge.id} variant="secondary">
                    {badge.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </dl>
  )
}

export function ReviewStep({
  copy,
  sections,
  layout = 'cards',
  defaultOpenSection,
}: ReviewStepProps) {
  const hasHeader = Boolean(copy.heading || copy.description)

  return (
    <div className="space-y-6">
      {hasHeader ? (
        <div className="space-y-1">
          {copy.heading ? (
            <h3 className="text-base font-bold text-slate-900">
              {copy.heading}
            </h3>
          ) : null}
          {copy.description ? (
            <p className="text-sm text-slate-500">{copy.description}</p>
          ) : null}
        </div>
      ) : null}

      {layout === 'accordion' ? (
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultOpenSection ?? sections[0]?.id}
          className="flex flex-col gap-3"
        >
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className={accordionItemClassName}
            >
              <AccordionTrigger className={accordionTriggerClassName}>
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <ReviewSectionItems
                  items={section.items}
                  emptyValue={copy.emptyValue}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <ReviewCardSection key={section.id} title={section.title}>
              <ReviewSectionItems
                items={section.items}
                emptyValue={copy.emptyValue}
              />
            </ReviewCardSection>
          ))}
        </div>
      )}
    </div>
  )
}
