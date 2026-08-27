import type { TerminationCodeFormValues } from '#/components/admin/termination-code/termination-code.schema.ts'
import type { TerminationCodeApiItem } from '#/types/termination-code.ts'

export function mapTerminationCodeDetailToFormValues(
  item: TerminationCodeApiItem,
): Partial<TerminationCodeFormValues> {
  const isCobraNotice = item.actionCode === 1
  const coverageMonthNum =
    typeof item.coverageMonth === 'number'
      ? item.coverageMonth
      : Number(item.coverageMonth) || 0

  const cobraTerm =
    coverageMonthNum === 18
      ? '18months'
      : coverageMonthNum === 36
        ? '36months'
        : coverageMonthNum > 0
          ? 'non-standard'
          : '18months'

  return {
    code: item.code ?? '',
    name: item.name ?? item.title ?? '',
    bcCode: item.bcCode ?? '',
    nepaCode: item.nepaCode ?? '',
    cobraNotice: isCobraNotice,
    cobraTerm,
    cobraMonths: coverageMonthNum,
  }
}
