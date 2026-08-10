import type { CoverageCodeApiItem } from '#/types/coverage-code.ts'
import type { CoverageCodeFormValues } from '#/components/admin/coverage-code/coverage-code.schema.ts'

export function mapCoverageCodeDetailToFormValues(
  detail: CoverageCodeApiItem,
): CoverageCodeFormValues {
  return {
    code: detail.code ?? '',
    name: detail.matrixName ?? detail.title ?? '',
    carrierId: detail.carrierId ?? '',
    coverageClassId: detail.coverageClassId ?? '',
    codeInvoice: (detail as unknown as Record<string, string>).codeInvoice ?? '',
    invoiceInclude: detail.invoiceInclude ?? false,
    codeReport: (detail as unknown as Record<string, string>).codeReport ?? '',
    title: detail.title ?? detail.description ?? '',
    shortTitle: (detail as unknown as Record<string, string>).shortTitle ?? detail.code ?? '',
    remittanceTypeId: detail.remittanceTypeId ?? '',
    invoiceGroup: detail.invoiceGroup ?? '',
    notes: (detail as unknown as Record<string, string>).notes ?? '',
  }
}
