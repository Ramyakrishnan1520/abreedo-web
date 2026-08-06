import { apiClient } from '#/api/api-client.ts'

import {
  GROUP_TYPE_LOOKUP_ID,
  type LookupCode,
  type LookupCodeApiItem,
  type LookupCodeListResponse,
} from '#/types/lookup-code.ts'

function mapLookupCode(item: LookupCodeApiItem): LookupCode | null {
  const codeId = item.codeId?.trim()
  const codeName = item.codeName?.trim()

  if (!codeId || !codeName) {
    return null
  }

  return {
    codeId,
    codeName,
    codeValue: item.codeValue?.trim() ?? '',
    lookupId: Number(item.lookupId),
  }
}

function extractLookupCodeItems(
  data: LookupCodeListResponse,
): LookupCodeApiItem[] {
  if (Array.isArray(data)) {
    return data
  }

  return (
    data.data ?? data.lookupCodes ?? data.items ?? data.results ?? []
  )
}

function mapLookupCodeItems(items: LookupCodeApiItem[]): LookupCode[] {
  return items
    .map(mapLookupCode)
    .filter((item): item is LookupCode => item != null)
}

async function fetchLookupCodes(): Promise<LookupCode[]> {
  const { data } = await apiClient.get<LookupCodeListResponse>(
    '/api/v1/lookup-codes',
  )

  return mapLookupCodeItems(extractLookupCodeItems(data))
}

export async function getGroupTypeLookupCodesApi(): Promise<LookupCode[]> {
  const codes = await fetchLookupCodes()

  return codes
    .filter((item) => item.lookupId === GROUP_TYPE_LOOKUP_ID)
    .sort((a, b) => a.codeName.localeCompare(b.codeName))
}
