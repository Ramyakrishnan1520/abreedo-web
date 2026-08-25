export function resolveOptionLabel<
  T extends { id: string | number; name?: string | null; code?: string | null },
>(
  selectedId: string | number | undefined | null,
  items: T[] = [],
  fallbackName?: string | null,
): string | undefined {
  if (selectedId === undefined || selectedId === null || selectedId === '') {
    return undefined
  }

  const match = items.find((item) => String(item.id) === String(selectedId))
  if (match) {
    return match.name || match.code || String(selectedId)
  }

  return fallbackName || String(selectedId)
}
