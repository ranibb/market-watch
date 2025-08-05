import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import App from './App.vue'
import router from './router'

// We make this async to wait for the user to be checked
async function startApp() {
  const app = createApp(App)
  app.use(createPinia())

  const authStore = useAuthStore()
  await authStore.init() // Wait for the initial user check

  app.use(router)
  app.mount('#app')
}

startApp()
