<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMarketStore } from '@/stores/market'
import GlobalLoadingIndicator from '@/components/GlobalLoadingIndicator.vue'
import GlobalErrorDisplay from '@/components/GlobalErrorDisplay.vue'

// Get access to the store
const marketStore = useMarketStore()
</script>

<template>
  <!-- These global components are now controlled by the store -->
  <GlobalLoadingIndicator v-if="marketStore.isLoading" />
  <GlobalErrorDisplay v-if="marketStore.error" />

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
</style>
