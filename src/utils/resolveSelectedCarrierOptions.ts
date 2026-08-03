import type { AvailableCarrierOption } from '#/types/parent-company.ts'

export function resolveSelectedCarrierOptions(
  carrierIds: string[],
  loadedCarriers: AvailableCarrierOption[],
  linkedCarriers: AvailableCarrierOption[] = [],
): AvailableCarrierOption[] {
  const byId = new Map<string, AvailableCarrierOption>()

  for (const carrier of linkedCarriers) {
    byId.set(carrier.id, carrier)
  }

  for (const carrier of loadedCarriers) {
    byId.set(carrier.id, carrier)
  }

  return [...new Set(carrierIds)]
    .map((id) => byId.get(id))
    .filter((carrier): carrier is AvailableCarrierOption => Boolean(carrier))
}
