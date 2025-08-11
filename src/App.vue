<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMarketStore } from '@/stores/market'
import { useAuthStore } from '@/stores/auth'
import GlobalLoadingIndicator from '@/components/GlobalLoadingIndicator.vue'
import { initializeToastService } from '@/services/toastService'
import { initializeConfirmationService } from '@/services/confirmationService'
import { confirmAction } from '@/services/confirmationService'
import ThemeToggler from '@/components/ThemeToggler.vue'

// Import PrimeVue components
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

initializeToastService()
initializeConfirmationService()

const marketStore = useMarketStore()
const authStore = useAuthStore()

const handleLogout = async () => {
  const confirmed = await confirmAction('Are you sure you want to log out?')
  if (confirmed) {
    authStore.logout()
  }
}
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <GlobalLoadingIndicator v-if="marketStore.isLoading || authStore.isLoading" />

  <!-- The Toolbar provides a structured header -->
  <Toolbar class="app-toolbar">
    <template #start>
      <div class="logo-area">
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="40" height="40" />
        <h1>Derayah Market Watch</h1>
        <!-- Add a link to the home dashboard -->
        <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
        <!-- Add a link to the new portfolio page -->
        <RouterLink to="/portfolio" class="nav-link">Portfolio</RouterLink>
      </div>
    </template>

    <template #end>
      <!-- Conditionally render user info and logout button -->
      <div class="user-menu">
        <ThemeToggler />
        <div v-if="authStore.currentUser" class="user-info">
          <Avatar icon="pi pi-user" shape="circle" />
          <span class="username">{{ authStore.currentUser.email }}</span>
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            @click="handleLogout"
            severity="danger"
            text
          />
        </div>
      </div>
    </template>
  </Toolbar>

  <main class="main-content">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
.app-toolbar {
  margin-bottom: 2rem;
  border-radius: 8px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-area h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Adjust gap */
}
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 0.5rem; /* Add some space */
}

.username {
  font-weight: 500;
  font-size: 0.9rem;
}

.main-content {
  padding: 0 1rem;
}

.nav-link {
  margin-left: 1.5rem;
  text-decoration: none;
  color: var(--p-text-color);
  font-weight: 600;
}

/* Global styles for transitions should be in main.css */
/* Ensure these styles are in src/assets/main.css and NOT scoped */
</style>
