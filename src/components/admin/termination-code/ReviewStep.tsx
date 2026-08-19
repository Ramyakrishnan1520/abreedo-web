import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { TERMINATION_CODE_CONTENT } from '#/utils/termination-code-content.ts'

import type { TerminationCodeFormValues } from '#/components/admin/termination-code/termination-code.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

export function ReviewStep() {
  const form = useFormContext<TerminationCodeFormValues>()
  const values = form.getValues()
  const copy = TERMINATION_CODE_CONTENT.reviewStep
  const generalCopy = TERMINATION_CODE_CONTENT.generalStep

  const termLabel = useMemo(() => {
    if (!values.cobraTerm) return undefined
    return (
      generalCopy.cobraTermOptions.find((opt) => opt.value === values.cobraTerm)
        ?.label ?? values.cobraTerm
    )
  }, [values.cobraTerm, generalCopy.cobraTermOptions])

  const sections: ReviewSectionConfig[] = useMemo(
    () => [
      {
        id: 'general',
        title: copy.sections.general,
        items: [
          { type: 'text', label: copy.fields.code, value: values.code },
          { type: 'text', label: copy.fields.name, value: values.name },
        ],
      },
      {
        id: 'additional',
        title: copy.sections.additional,
        items: [
          { type: 'text', label: copy.fields.bccCode, value: values.bccCode },
          {
            type: 'text',
            label: copy.fields.nepaCode,
            value: values.nepaCode,
          },
        ],
      },
      {
        id: 'cobra',
        title: copy.sections.cobra,
        items: values.cobraNotice
          ? [
            {
              type: 'text',
              label: copy.fields.cobraNotice,
              value: copy.yes,
            },
            {
              type: 'text',
              label: copy.fields.cobraTerm,
              value: termLabel,
            },
            {
              type: 'text',
              label: copy.fields.cobraMonths,
              value: String(values.cobraMonths ?? 0),
            },
          ]
          : [
            {
              type: 'text',
              label: copy.fields.cobraNotice,
              value: copy.no,
            },
          ],
      },
    ],
    [values, termLabel, copy],
  )

  return (
    <CommonReviewStep
      copy={{
        heading: copy.heading,
        description: copy.description,
        emptyValue: '—',
      }}
      sections={sections}
      layout="cards"
    />
  )
}
