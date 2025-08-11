<!-- src/views/PortfolioView.vue in the SHELL app -->
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// This is the magic! We are dynamically importing a component
// from a completely separate application.
// 'portfolio_app' is the name we defined in our vite.config.ts.
// '/PortfolioSummary' is the path we exposed in the remote's vite.config.ts.
const PortfolioSummary = defineAsyncComponent(() => import('portfolio_app/PortfolioSummary'))
</script>

<template>
  <div class="portfolio-view">
    <h2>My Portfolio</h2>
    <p>
      This page demonstrates loading a micro-frontend from a separate, independently deployed
      application.
    </p>
    <hr />
    <!-- Vue will handle the loading state for us -->
    <Suspense>
      <template #default>
        <PortfolioSummary />
      </template>
      <template #fallback>
        <div>Loading portfolio component...</div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
hr {
  margin: 2rem 0;
}
</style>
