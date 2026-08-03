import type { ParentCompanyStepId } from '#/types/parent-company.ts'

export interface ParentCompanyContent {
  pages: {
    index: {
      kicker: string
      title: string
      description: string
      chooseHeading: string
      cards: {
        newSetup: { title: string; description: string }
        update: { title: string; description: string }
      }
    }
    edit: {
      kicker: string
      title: string
      description: string
      selectLabel: string
      selectCardDescription: string
      selectPlaceholder: string
      selectLoadingPlaceholder: string
      selectSearchPlaceholder: string
      selectNoResults: string
      selectPrompt: string
      emptyStateTitle: string
      editingLabel: string
      loadingDetails: string
      errors: {
        listLoad: string
        detailLoad: string
      }
    }
  }
  form: {
    kicker: string
    titles: { create: string; edit: string }
    saveLabels: { create: string; edit: string }
    navigation: { back: string; next: string }
    validationSummary: string
    steps: Array<{ id: ParentCompanyStepId; label: string; index: number }>
  }
  generalStep: Record<string, string>
  contactStep: Record<string, string>
  carriersStep: Record<string, string>
  notesStep: Record<string, string>
  reviewStep: {
    heading: string
    description: string
    emptyValue: string
    noCarriersSelected: string
    sections: {
      general: string
      primaryAddress: string
      contact: string
      carriers: string
      notes: string
    }
    fields: {
      name: string
      fullName:String
      address1: string
      address2: string
      city: string
      state: string
      zipCode: string
      firstName: string
      lastName: string
      phone: string
      alternativePhone: string
      fax: string
      email: string
      website: string
    }
  }
  validation: Record<string, string>
  toasts: {
    create: { success: string; error: string }
    update: { success: string; error: string }
  }
}
