import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import ReviewSection from '#/components/admin/common/ReviwSection.tsx'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { TerminationCodeFormValues } from '#/components/admin/termination-code/termination-code.schema.ts'

export function ReviewStep() {
  const form = useFormContext<TerminationCodeFormValues>()
  const values = form.getValues()
  const copy = TERMINATION_CODE_CONTENT.reviewStep
  const generalCopy = TERMINATION_CODE_CONTENT.generalStep

  const generalItems = useMemo(
    () => [
      { label: copy.fields.code, value: values.code },
      { label: copy.fields.name, value: values.name },
    ],
    [values.code, values.name, copy.fields],
  )

  const additionalItems = useMemo(
    () => [
      { label: copy.fields.bccCode, value: values.bccCode },
      { label: copy.fields.nepaCode, value: values.nepaCode },
    ],
    [values.bccCode, values.nepaCode, copy.fields],
  )

  const termLabel = useMemo(() => {
    if (!values.cobraTerm) return undefined
    return (
      generalCopy.cobraTermOptions.find((opt) => opt.value === values.cobraTerm)
        ?.label ?? values.cobraTerm
    )
  }, [values.cobraTerm, generalCopy.cobraTermOptions])

  const cobraItems = useMemo(
    () =>
      values.cobraNotice
        ? [
            { label: copy.fields.cobraNotice, value: copy.yes },
            { label: copy.fields.cobraTerm, value: termLabel },
            {
              label: copy.fields.cobraMonths,
              value: String(values.cobraMonths ?? 0),
            },
          ]
        : [{ label: copy.fields.cobraNotice, value: copy.no }],
    [values.cobraNotice, values.cobraMonths, termLabel, copy],
  )

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">{copy.heading}</h3>
        <p className="text-sm text-slate-500">{copy.description}</p>
      </div>

      <div className="space-y-4">
        <ReviewSection
          title={copy.sections.general}
          items={generalItems}
        />
        <ReviewSection
          title={copy.sections.additional}
          items={additionalItems}
        />
        <ReviewSection
          title={copy.sections.cobra}
          items={cobraItems}
        />
      </div>
    </div>
  )
}
