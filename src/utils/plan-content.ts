export const PLAN_CONTENT = {
  list: {
    kicker: 'Plans',
    title: 'Plans',
    description:
      'Manage and view plan data with filters for parent company and carrier.',
    addButton: 'New Plan',
    loadErrorFallback: 'Unable to load plans. Please try again.',
    retry: 'Retry',
  },
  filters: {
    allParentCompanies: 'Select a parent company...',
    allCarriers: 'Select a carrier...',
    parentCompanyLabel: 'Parent Company',
    carrierLabel: 'Carrier',
    clearFilters: 'Clear Filters',
    loadingMore: 'Loading more...',
  },
  table: {
    emptyValue: '-',
    columns: {
      name: 'Name',
      code: 'Code',
      coverageCode: 'Coverage Code',
      option: 'Option',
      effectiveDate: 'Effective Date',
      edit: 'Edit',
      delete: 'Delete',
    },
    editAria: (name: string) => `Edit ${name}`,
    deleteAria: (name: string) => `Delete ${name}`,
  },
} as const
