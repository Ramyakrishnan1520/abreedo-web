export const EMPLOYER_CONTENT = {
  list: {
    kicker: 'Site Manager',
    title: 'Employers Table',
    description:
      'Manage employer records with reusable TanStack Table columns, pagination, and action controls.',
    selectParentCompanyLabel: 'Select Parent Company',
    selectParentCompanyPlaceholder: 'Select a parent company...',
    allParentCompaniesOption: 'All Parent Companies',
    loadErrorFallback: 'Unable to load employers. Please try again.',
    retry: 'Retry',
  },
  pages: {
    index: {
      kicker: 'Administration',
      title: 'Update Employers',
      description:
        'Select an action below to set up a new employer or manage existing employers.',
      chooseHeading: 'Please Choose',
      cards: {
        list: {
          title: 'List Employer',
          description: 'View available employers table',
        },
        new: {
          title: 'New Employer',
          description: 'Guided Employer Setup',
        },
        update: {
          title: 'Update Current Employer',
          description: 'Update Available Employers',
        },
      },
    },
  },
  table: {
    emptyValue: '-',
    columns: {
      name: 'Name',
      parentCompany: 'Parent Company',
      edit: 'Edit',
      delete: 'Delete',
    },
    editAria: (name: string) => `Edit ${name}`,
    deleteAria: (name: string) => `Delete ${name}`,
  },
} as const
