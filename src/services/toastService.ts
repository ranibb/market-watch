// src/services/toastService.ts
import type { ToastServiceMethods } from 'primevue'
import { useToast } from 'primevue/usetoast'

// This composable needs to be initialized, but we can't do it at the top level.
// We create a wrapper service that can be called from anywhere.
// This is a more advanced but very clean pattern.

let toastService: ToastServiceMethods

export const initializeToastService = () => {
  toastService = useToast()
}

export const showErrorToast = (message: string) => {
  if (!toastService) return
  toastService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 })
}

export const showSuccessToast = (message: string) => {
  if (!toastService) return
  toastService.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 })
}
