<script setup lang="ts">
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()

// Create a new action in the store to clear the error
const dismissError = () => {
  // We'll add this action to the store next
  marketStore.clearError()
}
</script>

<template>
  <div class="error-overlay">
    <div class="error-box">
      <h3>An Error Occurred</h3>
      <p>{{ marketStore.error }}</p>
      <button @click="dismissError">Dismiss</button>
    </div>
  </div>
</template>

<style scoped>
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.error-box {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #d83a3a;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
