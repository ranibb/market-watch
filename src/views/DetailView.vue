<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useMarketStore } from '@/stores/market'

// 1. Get access to the current route information
const route = useRoute()

// 2. Get an instance of the store. This is now our single source of truth.
const marketStore = useMarketStore()

// 3. Get the asset ID from the URL parameters (e.g., the 'bitcoin' in '/asset/bitcoin')
const assetId = route.params.id as string

// This computed property now points to our new, cache-aware getter
const assetDetails = computed(() => marketStore.getAssetDetailsById(assetId))

// The lifecycle hook is now responsible for triggering the intelligent fetch action
onMounted(() => {
  marketStore.fetchAssetDetailsIfNeeded(assetId)
})
</script>

<template>
  <div class="detail-view">
    <!-- A link to go back to the main dashboard -->
    <RouterLink
      to="/"
      class="back-link"
      >← Back to Dashboard</RouterLink
    >

    <div
      v-if="marketStore.isLoading"
      class="loading"
    >
      Loading details...
    </div>

    <!-- If after loading, the asset is still not found -->
    <div
      v-else-if="!assetDetails && !marketStore.isLoading"
      class="error-message"
    >
      <h2>Error</h2>
      <p>Could not load details for asset with ID "{{ assetId }}".</p>
    </div>

    <!-- Render the asset details once found -->
<div v-else-if="assetDetails" class="asset-details">
      <div class="asset-header">
        <img :src="assetDetails.image.large" :alt="assetDetails.name" class="asset-image-large" />
        <h1>{{ assetDetails.name }} ({{ assetDetails.symbol.toUpperCase() }})</h1>
      </div>

      <div class="asset-metrics">
        <div class="metric-item">
          <span class="metric-label">Price</span>
          <span class="metric-value">{{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(assetDetails.market_data.current_price.usd) }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Market Cap</span>
          <span class="metric-value">{{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(assetDetails.market_data.market_cap.usd) }}</span>
        </div>
      </div>
      
      <div class="asset-description">
        <h3>About {{ assetDetails.name }}</h3>
        <!-- We can now use the rich description from the details API -->
        <div v-html="assetDetails.description.en"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
}

.loading,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;
}

.error-message {
  color: #d83a3a;
  border: 1px solid #d83a3a;
  border-radius: 8px;
  background-color: #fff5f5;
}

.asset-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.asset-image-large {
  width: 64px;
  height: 64px;
}

h1 {
  margin: 0;
}

.asset-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.metric-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
}

.asset-description {
  line-height: 1.6;
}

/* Styles for the content coming from v-html */
.asset-description :deep(a) {
  color: #42b883;
}
</style>
