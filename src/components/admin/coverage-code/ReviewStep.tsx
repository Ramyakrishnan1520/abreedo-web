import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import ReviewSection from '#/components/admin/common/ReviwSection'
import { useGetCoverageClasses } from '#/hooks/coverage-code/useGetCoverageClasses.ts'
import { useGetCoverageTypes } from '#/hooks/coverage-code/useGetCoverageTypes.ts'
import { useInfiniteCarrierOptions } from '#/hooks/carrier/use-infinite-carrier-options.ts'
import { COVERAGE_CODE_CONTENT } from '#/utils/coverage-code-content.ts'
import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'


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

  const coverageTypeName = useMemo(() => {
    if (!values.remittanceTypeId) return undefined
    const match = coverageTypes.find(
      (ct) => ct.coverageTypeId === values.remittanceTypeId,
    )
    return match ? match.name || match.code : values.remittanceTypeId
  }, [coverageTypes, values.remittanceTypeId])

  const generalItems = [
    { label: copy.fields.code, value: values.code },
    { label: copy.fields.name, value: values.name },
    { label: copy.fields.carrier, value: carrierName },
    { label: copy.fields.coverageClass, value: coverageClassName },
    { label: copy.fields.coverageType, value: coverageTypeName },
  ]

  const processingItems = [
    { label: copy.fields.combinationForBill, value: values.codeInvoice },
    { label: copy.fields.combinationForReports, value: values.codeReport },
    {
      label: copy.fields.useForBill,
      value: values.invoiceInclude ? copy.yes : copy.no,
    },
    { label: copy.fields.description, value: values.title },
    { label: copy.fields.shortDescription, value: values.shortTitle },
    { label: copy.fields.invoiceGroup, value: values.invoiceGroup },
  ]

  const notesItems = [{ label: copy.fields.notes, value: values.notes }]

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
          title={copy.sections.processing}
          items={processingItems}
        />
        <ReviewSection
          title={copy.sections.notes}
          items={notesItems}
        />
      </div>
    </div>
  )
}
