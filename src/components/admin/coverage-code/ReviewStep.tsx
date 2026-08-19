import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { ReviewStep as CommonReviewStep } from '#/components/admin/common/ReviewSection'
import { useGetCoverageClasses } from '#/hooks/coverage-code/useGetCoverageClasses.ts'
import { useGetCoverageTypes } from '#/hooks/coverage-code/useGetCoverageTypes.ts'
import { useInfiniteCarrierOptions } from '#/hooks/carrier/use-infinite-carrier-options.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'

import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'
import type { ReviewSectionConfig } from '#/types/review-steps.ts'

export function ReviewStep() {
  const form = useFormContext<CoverageCodeFormValues>()
  const copy = COVERAGE_CODE_CONTENT.reviewStep
  const values = form.getValues()

  const { carriers } = useInfiniteCarrierOptions()
  const { data: coverageClasses = [] } = useGetCoverageClasses()
  const { data: coverageTypes = [] } = useGetCoverageTypes()

  const carrierName = useMemo(() => {
    if (!values.carrierId) return undefined
    return (
      carriers.find((c) => String(c.id) === String(values.carrierId))?.name ??
      values.carrierId
    )
  }, [carriers, values.carrierId])

  const coverageClassName = useMemo(() => {
    if (!values.coverageClassId) return undefined
    const match = coverageClasses.find(
      (cc) => cc.coverageClassId === values.coverageClassId,
    )
    return match ? match.name || match.code : values.coverageClassId
  }, [coverageClasses, values.coverageClassId])

  const remittanceTypeName = useMemo(() => {
    if (!values.remittanceTypeId) return undefined
    const match = coverageTypes.find(
      (ct) => ct.coverageTypeId === values.remittanceTypeId,
    )
    return match ? match.name || match.code : values.remittanceTypeId
  }, [coverageTypes, values.remittanceTypeId])

  const sections: ReviewSectionConfig[] = useMemo(
    () => [
      {
        id: 'general',
        title: copy.sections.general,
        items: [
          { type: 'text', label: copy.fields.code, value: values.code },
          { type: 'text', label: copy.fields.name, value: values.name },
          { type: 'text', label: copy.fields.carrier, value: carrierName },
          {
            type: 'text',
            label: copy.fields.coverageClass,
            value: coverageClassName,
          },
          {
            type: 'text',
            label: copy.fields.remittanceType,
            value: remittanceTypeName,
          },
        ],
      },
      {
        id: 'processing',
        title: copy.sections.processing,
        items: [
          {
            type: 'text',
            label: copy.fields.combinationForBill,
            value: values.codeInvoice,
          },
          {
            type: 'text',
            label: copy.fields.combinationForReports,
            value: values.codeReport,
          },
          {
            type: 'text',
            label: copy.fields.useForBill,
            value: values.invoiceInclude ? copy.yes : copy.no,
          },
          {
            type: 'text',
            label: copy.fields.description,
            value: values.title,
          },
          {
            type: 'text',
            label: copy.fields.shortDescription,
            value: values.shortTitle,
          },
          {
            type: 'text',
            label: copy.fields.invoiceGroup,
            value: values.invoiceGroup,
          },
        ],
      },
      {
        id: 'notes',
        title: copy.sections.notes,
        items: [
          {
            type: 'multiline',
            value: values.notes,
          },
        ],
      },
    ],
    [
      copy,
      values,
      carrierName,
      coverageClassName,
      remittanceTypeName,
    ],
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
