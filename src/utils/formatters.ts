/**
 * Formats a raw or partially formatted phone number string into US format: `(XXX) XXX-XXXX`.
 */
export function formatPhoneNumber(value: string | null | undefined): string {
  if (!value) return ''

  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function formatEffectiveDate(value?: string | null): string {
  if (!value || !value.trim()) return ''
  const dateOnly = value.split('T')[0]?.trim()
  if (!dateOnly) return ''
  return `${dateOnly}T00:00:00`
}