// src/services/confirmationService.ts
import type { ConfirmationOptions } from 'primevue/confirmationoptions'
import { useConfirm } from 'primevue/useconfirm'

let confirmService: {
  require: (options: ConfirmationOptions) => void
  close: () => void
}

export const initializeConfirmationService = () => {
  confirmService = useConfirm()
}

export const confirmAction = (message: string, header = 'Confirmation') => {
  return new Promise((resolve) => {
    if (!confirmService) {
      resolve(false) // Should not happen if initialized correctly
      return
    }
    confirmService.require({
      header: header,
      message: message,
      icon: 'pi pi-exclamation-triangle',
      accept: () => resolve(true),
      reject: () => resolve(false),
    })
  })
}
