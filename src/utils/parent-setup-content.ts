export const PARENT_SETUP_CONTENT = {
  kicker: 'Administration',
  title: 'Parent Company Setup',
  description:
    'Select a task below to configure parent companies, carriers, coverage codes, termination codes, or plans.',
  chooseHeading: 'Select a Task',
  tasks: {
    parentCompany: {
      title: 'Parent Company Setup',
      description: 'Manage parent companies.',
    },
    carriersCoverage: {
      title: 'Carriers & Coverage Code Setup',
      description: 'Manage carriers and coverage codes.',
    },
    terminationCode: {
      title: 'Termination Code Setup',
      description: 'Manage member termination codes.',
    },
    planSetup: {
      title: 'Plan Setup',
      description: 'Manage plans for employer groups.',
    },
  },
} as const

export type ParentSetupContent = typeof PARENT_SETUP_CONTENT
