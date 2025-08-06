import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

// Corrected Path: The import must include the @primevue scope
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

// We make this async to wait for the user to be checked
async function startApp() {
  const app = createApp(App)

  app.use(createPinia())

  // Use the new, correct configuration method
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: 'p', // This is the default prefix for classes
        darkModeSelector: '.dark-theme', // Can be 'system', 'class', or a custom selector
        cssLayer: false, // Set to true for advanced CSS layering
      },
    },
  })

  app.use(ToastService)
  app.use(ConfirmationService)

  const authStore = useAuthStore()
  await authStore.init() // Wait for the initial user check

  app.use(router)
  app.mount('#app')
}

startApp()
