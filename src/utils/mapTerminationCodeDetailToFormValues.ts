import type { TerminationCodeFormValues } from '#/components/admin/termination-code/termination-code.schema.ts'
import type { TerminationCodeApiItem } from '#/types/termination-code.ts'

export function mapTerminationCodeDetailToFormValues(
  item: TerminationCodeApiItem,
): Partial<TerminationCodeFormValues> {
  const isCobraNotice = item.actionCode === 1

  return {
    code: item.code ?? '',
    name: item.name ?? item.title ?? '',
    bccCode: item.bccCode ?? '',
    nepaCode: item.nepaCode ?? '',
    cobraNotice: isCobraNotice,
    cobraTerm: item.cobraTerm ?? '18months',
    cobraMonths:
      typeof item.cobraMonths === 'number'
        ? item.cobraMonths
        : typeof item.coverageMonths === 'number'
          ? item.coverageMonths
          : Number(item.coverageMonths) || 0,
  }
}
