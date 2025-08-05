<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMarketStore } from '@/stores/market'
import { useAuthStore } from '@/stores/auth'
import GlobalLoadingIndicator from '@/components/GlobalLoadingIndicator.vue'
import GlobalErrorDisplay from '@/components/GlobalErrorDisplay.vue'

// Get access to the store
const marketStore = useMarketStore()
const authStore = useAuthStore()
</script>

<template>
  <!-- These global components are now controlled by the store -->
  <GlobalLoadingIndicator v-if="marketStore.isLoading || authStore.isLoading" />
  <GlobalErrorDisplay v-if="marketStore.error" />

  <header class="app-header">
    <div class="wrapper">
      <h1>Market Watch</h1>
      <!-- Add a navigation section -->
      <nav v-if="authStore.currentUser">
        <span>Welcome, {{ authStore.currentUser.email }}</span>
        <button @click="authStore.logout" class="logout-button">Logout</button>
      </nav>
    </div>
  </header>

  <main>
    <!-- Wrap the RouterView with the Transition component -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
.app-header {
  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

.app-header h1 {
  text-align: center;
  font-weight: 600;
  color: #333;
}

.app-header .wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

nav span {
  font-size: 0.9rem;
}

.logout-button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #42b883;
  background-color: transparent;
  color: #42b883;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.logout-button:hover {
  background-color: #42b883;
  color: white;
}
</style>
